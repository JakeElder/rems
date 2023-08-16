import { NextRequest } from "next/server";
import * as remi from "@/remi";
import { RealEstateQuery } from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import { z } from "zod";
import { ReviseArrayReturn } from "@/remi";

const { revise } = remi;

type Chunk =
  | { type: "STRATEGY"; value: string }
  | { type: "PATCH"; data: Partial<RealEstateQuery> }
  | { type: "LOCATION"; location: any }
  | { type: "RESPOND_GENERAL"; message: string }
  | { type: "SUMMARY"; data: any };

type ArrayKey = keyof z.infer<typeof RealEstateQuerySchema.Arrays>;

type Stream = (
  nl: string,
  query: RealEstateQuery
) => UnderlyingDefaultSource["start"];

const encoder = new TextEncoder();

const stream: Stream = (nl, query) => async (c) => {
  const send = (data: Chunk) => {
    const chunk = encoder.encode(`${JSON.stringify(data)}\n`);
    c.enqueue(chunk);
  };

  const req = {
    capability: remi.capability.identify(nl),
    indoorFeatures: revise.indoorFeatures(nl, query["indoor-features"]),
    outdoorFeatures: revise.outdoorFeatures(nl, query["outdoor-features"]),
    lotFeatures: revise.lotFeatures(nl, query["lot-features"]),
    propertyTypes: revise.propertyTypes(nl, query["property-types"]),
    viewTypes: revise.viewTypes(nl, query["view-types"]),
    respondGeneral: remi.capability.respondGeneral(nl)
  };

  const capability = await req.capability;

  if (capability?.ok) {
    send({ type: "STRATEGY", value: capability.data });
  }

  const arr = async (
    req: Promise<ReviseArrayReturn>,
    key: ArrayKey
  ): Promise<Partial<Record<ArrayKey, Partial<RealEstateQuery> | null>>> => {
    const res = await req;
    if (res?.ok) {
      send({ type: "PATCH", data: { [key]: res.data } });
      return { [key]: res.data };
    }
    return { [key]: null };
  };

  const res = await Promise.all([
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

// const res = await Promise.all([
//   tasks.location.then((location) => {
//     send({ type: "LOCATION", location });
//     return { location };
//   }),

//   remi.revise.budget(query, nl).then((res) => {
//     if (res && res.ok) {
//       send({ type: "PATCH", data: res.value });
//     }
//     return { budget: data };
//   }),
// ]);
