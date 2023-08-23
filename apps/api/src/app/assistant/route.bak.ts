import { NextRequest } from "next/server";
import * as remi from "@/remi";
import { Chunk, Filter, RealEstateQuery } from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import { z } from "zod";
import { RefineArrayReturn } from "@/remi";
import { pickBy } from "remeda";

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

type MapState = z.infer<typeof RealEstateQuerySchema.MapState>;
type PageAndSort = z.infer<typeof RealEstateQuerySchema.PageAndSort>;
type SpaceRequirements = z.infer<
  typeof RealEstateQuerySchema.SpaceRequirements
>;
type BudgetAndAvailability = z.infer<
  typeof RealEstateQuerySchema.BudgetAndAvailability
>;
type ArrayKey = keyof z.infer<typeof RealEstateQuerySchema.Arrays>;

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

const stream: Stream = (nl, query) => async (c) => {
  const refine = (r: Refinement) => {
    if (r.type === "ARRAY") {
      send({ type: "PATCH", data: { [r.key]: r.data } });
    } else if (Object.keys(r.data).length > 0) {
      send({ type: "PATCH", data: r.data });
    }
  };

  const send = (data: Chunk) => {
    const chunk = encoder.encode(`${JSON.stringify(data)}\n`);
    c.enqueue(chunk);
  };

  const req = {
    capability: remi.capability.identify(nl),
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
    ),
    indoorFeatures: remi.refine.indoorFeatures(nl, query["indoor-features"]),
    outdoorFeatures: remi.refine.outdoorFeatures(nl, query["outdoor-features"]),
    lotFeatures: remi.refine.lotFeatures(nl, query["lot-features"]),
    propertyTypes: remi.refine.propertyTypes(nl, query["property-types"]),
    viewTypes: remi.refine.viewTypes(nl, query["view-types"]),
    respondGeneral: remi.capability.respondGeneral(nl)
  };

  const capability = await req.capability;

  if (capability?.ok) {
    send({ type: "STRATEGY", value: capability.data });
    if (capability.data === "CQ") {
      c.close();
      return;
    }
  }

  const arr = async (
    req: Promise<RefineArrayReturn>,
    key: ArrayKey
  ): Promise<Partial<RealEstateQuery>> => {
    const res = await req;
    if (res?.ok && res.data) {
      if (res.data) {
        refine({ type: "ARRAY", key, data: res.data });
      }
      return { [key]: res.data };
    }
    return { [key]: null };
  };

  const res = await Promise.all([
    /*
     * Location
     */
    (async () => {
      const res = await req.location;
      if (res?.ok) {
        send({ type: "LOCATION", location: res.data });
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
    })(),

    /*
     * Arrays
     */
    arr(req.indoorFeatures, "indoor-features"),
    arr(req.outdoorFeatures, "outdoor-features"),
    arr(req.lotFeatures, "lot-features"),
    arr(req.propertyTypes, "property-types"),
    arr(req.viewTypes, "view-types"),

    /*
     * General Response
     */
    (async () => {
      if (capability?.ok && capability?.data === "RGQ") {
        const res = await req.respondGeneral;
        if (res?.ok) {
          send({ type: "RESPOND_GENERAL", message: res.data });
          return { generalResponse: res.data };
        }
      }
      return { generalResponse: null };
    })()
  ]);

  const summary: Chunk = {
    type: "SUMMARY",
    data: res.reduce((strategy, value) => ({ ...strategy, ...value }), {})
  };

  console.dir(
    { query: nl, capability: capability, strategy: summary.data },
    { depth: null, colors: true }
  );

  send(summary);

  c.close();
};

export async function POST(req: NextRequest) {
  const data = await req.json();
  const query = RealEstateQuerySchema.URL.parse(data.query);

  return new Response(new ReadableStream({ start: stream(data.nl, query) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
