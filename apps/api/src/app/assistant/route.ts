import { NextRequest } from "next/server";
import * as remi from "@/remi";
import { Chunk, Filter, RealEstateQuery } from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import { z } from "zod";

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

  const analysis = await remi.capability.analyze(nl);

  if (!analysis?.ok) {
    console.dir(analysis, { depth: null, colors: true });
    throw new Error();
  }

  const indoorFeatures = await remi.diff.indoorFeatures(
    nl,
    query["indoor-features"]
  );

  console.dir(
    { query: nl, analysis, indoorFeatures },
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
