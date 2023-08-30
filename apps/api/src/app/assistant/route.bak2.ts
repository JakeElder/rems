import { NextRequest } from "next/server";
import * as remi from "@/remi";
import { Chunk, Filter, IntentCode, RealEstateQuery } from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import { z } from "zod";
import { FilterArrayFn } from "../../remi/refine";
import memoize from "memoizee";
import { pickBy } from "remeda";
import { nlToLocation } from "../../utils/nl-to-location";

type MapState = z.infer<typeof RealEstateQuerySchema.MapState>;
type PageAndSort = z.infer<typeof RealEstateQuerySchema.PageAndSort>;
type SpaceRequirements = z.infer<
  typeof RealEstateQuerySchema.SpaceRequirements
>;
type BudgetAndAvailability = z.infer<
  typeof RealEstateQuerySchema.BudgetAndAvailability
>;
type ArrayKey = keyof z.infer<typeof RealEstateQuerySchema.Arrays>;

const { terse } = remi;

type Refinement =
  | { type: "LOCATION"; data: any }
  | { type: "MAP_STATE"; data: Partial<MapState> }
  | { type: "PAGE_AND_SORT"; data: Partial<PageAndSort> }
  | { type: "SPACE_REQUIREMENTS"; data: Partial<SpaceRequirements> }
  | { type: "BUDGET_AND_AVAILABILITY"; data: Partial<BudgetAndAvailability> }
  | { type: "ARRAY"; key: ArrayKey; data: Filter["slug"][] };

type Stream = (
  nl: string,
  query: RealEstateQuery
) => UnderlyingDefaultSource["start"];

const encoder = new TextEncoder();

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

const stream: Stream = (nl, query) => async (c) => {
  const send = (data: Chunk) => {
    const chunk = encoder.encode(`${JSON.stringify(data)}\n`);
    c.enqueue(chunk);
  };

  const refine = (r: Refinement) => {
    if (r.type === "ARRAY") {
      send({ type: "PATCH", data: { [r.key]: r.data } });
    } else if (Object.keys(r.data).length > 0) {
      send({ type: "PATCH", data: r.data });
    }
  };

  const intents = memoize(async () => {
    const res = await remi.capability.analyze(nl);
    if (!res?.ok) throw new Error();
    return res.data;
  });

  // const capability = memoize(async () => {
  //   const res = await remi.capability.identify(nl);
  //   if (!res?.ok) throw new Error();
  //   return res.data;
  // });

  const rr = remi.refine;
  const tuples: [IntentCode, ArrayKey, FilterArrayFn][] = [
    ["REFINE_INDOOR_FEATURES", "indoor-features", rr.indoorFeatures],
    ["REFINE_OUTDOOR_FEATURES", "outdoor-features", rr.outdoorFeatures],
    ["REFINE_LOT_FEATURES", "lot-features", rr.lotFeatures],
    ["REFINE_PROPERTY_TYPES", "property-types", rr.propertyTypes],
    ["REFINE_VIEW_TYPES", "view-types", rr.viewTypes]
  ];

  const arrReqs = tuples.map(async ([intent, key, fn]) => {
    return fn(nl, query[key]).then(async (res) => {
      if (!terse.intents(await intents()).includes(intent)) {
        return;
      }
      if (res?.ok && res.data) {
        refine({ type: "ARRAY", key, data: res.data });
        return { [key]: res.data };
      }
    });
  });

  const req = {
    location: remi.refine.location(nl),
    mapState: remi.refine.mapState(
      nl,
      RealEstateQuerySchema.MapState.parse(query)
    ),
    pageAndSort: remi.refine.pageAndSort(
      nl,
      RealEstateQuerySchema.PageAndSort.parse(query)
    ),
    spaceRequirements: remi.refine.spaceRequirements(
      nl,
      RealEstateQuerySchema.SpaceRequirements.parse(query)
    ),
    budgetAndAvailability: remi.refine.budgetAndAvailability(
      nl,
      RealEstateQuerySchema.BudgetAndAvailability.parse(query)
    )
  };

  const res = [
    /*
     * Location
     */
    (async () => {
      const res = await req.location;
      if (res?.ok) {
        const l = await nlToLocation(res.data.origin);
        if (l) {
          send({
            type: "PATCH",
            data: {
              "origin-lat": l.lat,
              "origin-lng": l.lng,
              "origin-id": l.placeId
            }
          });
        }
        return { location: res.data };
      }
      return { location: null };
    })(),

    /*
     * Map State
     */
    (async () => {
      const res = await req.mapState;
      if (res?.ok) {
        refine({ type: "MAP_STATE", data: defined(res.data) });
        return { mapState: res.data };
      }
      return { mapState: null };
    })(),

    /*
     * Page & Sort
     */
    (async () => {
      const res = await req.pageAndSort;
      if (res?.ok) {
        refine({ type: "PAGE_AND_SORT", data: defined(res.data) });
        return { pageAndSort: res.data };
      }
      return { pageAndSort: null };
    })(),

    /*
     * Space Requirements
     */
    (async () => {
      const res = await req.spaceRequirements;
      if (res?.ok) {
        refine({ type: "SPACE_REQUIREMENTS", data: defined(res.data) });
        return { spaceRequirements: res.data };
      }
      return { spaceRequirements: null };
    })(),

    /*
     * Budget & Availability
     */
    (async () => {
      const res = await req.budgetAndAvailability;
      if (res?.ok) {
        refine({ type: "BUDGET_AND_AVAILABILITY", data: defined(res.data) });
        return { budgetAndAvailability: res.data };
      }
      return { budgetAndAvailability: null };
    })()
  ];

  const [arrays, patches] = await Promise.all([
    Promise.all(arrReqs),
    Promise.all(res)
  ]);

  console.dir(
    {
      input: nl,
      // capability: terse.capability(await capability()),
      intents: terse.intents(await intents()),
      patches,
      arrays: arrays.reduce((p, c) => {
        if (!c) return p;
        return { ...p, ...c };
      }, {})
    },
    { colors: true, depth: null }
  );

  c.close();
};

export async function POST(req: NextRequest) {
  const data = await req.json();
  const query = RealEstateQuerySchema.URL.parse(data.query);

  return new Response(new ReadableStream({ start: stream(data.nl, query) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
