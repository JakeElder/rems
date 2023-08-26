import { NextRequest } from "next/server";
import * as remi from "@/remi";
import { Chunk, Filter, RealEstateQuery } from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import { z } from "zod";
import { RefineArrayReturn } from "@/remi";

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

  const reqs = {
    analysis: remi.capability.analyze(nl),
    indoorFeatures: remi.diff.indoorFeatures(nl, query["indoor-features"]),
    outdoorFeatures: remi.diff.outdoorFeatures(nl, query["outdoor-features"]),
    lotFeatures: remi.diff.lotFeatures(nl, query["lot-features"]),
    propertyTypes: remi.diff.propertyTypes(nl, query["property-types"]),
    viewTypes: remi.diff.viewTypes(nl, query["view-types"])
  };

  const arr = async (
    req: Promise<RefineArrayReturn>,
    key: ArrayKey
  ): Promise<Partial<RealEstateQuery>> => {
    const analysis = await reqs.analysis;
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
     * Arrays
     */
    arr(reqs.indoorFeatures, "indoor-features"),
    arr(reqs.outdoorFeatures, "outdoor-features"),
    arr(reqs.lotFeatures, "lot-features"),
    arr(reqs.propertyTypes, "property-types"),
    arr(reqs.viewTypes, "view-types")
  ]);

  const summary: Chunk = {
    type: "SUMMARY",
    data: res.reduce((strategy, value) => ({ ...strategy, ...value }), {})
  };

  console.dir(
    { query: nl, analysis: await reqs.analysis, summary },
    { depth: null, colors: true }
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
