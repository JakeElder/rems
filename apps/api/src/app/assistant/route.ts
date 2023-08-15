import { NextRequest } from "next/server";
import * as remi from "@/remi";
import { RealEstateQuery } from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";

const { revise } = remi;

type Chunk =
  | { type: "STRATEGY"; value: string }
  | { type: "PATCH"; data: Partial<RealEstateQuery> }
  | { type: "LOCATION"; location: any }
  | { type: "RESPOND_GENERAL"; message: string }
  | { type: "SUMMARY"; data: any };

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

  const code = await remi.capability.identify(nl);

  if (code && code.ok) {
    send({ type: "STRATEGY", value: code.data });
  }

  const res = await Promise.all([
    /*
     * Indoor Features
     */
    (async () => {
      const res = await revise.indoorFeatures(nl, query["indoor-features"]);
      if (res && res.ok) {
        send({
          type: "PATCH",
          data: { "indoor-features": res.data }
        });
      }
      return { indoorFeatures: res && res.ok ? res.data : null };
    })(),

    /*
     * General Response
     */
    (async () => {
      if (!code?.ok || code?.data !== "RGQ") {
        return { generalResponse: null };
      }
      const res = await remi.capability.respondGeneral(nl);
      if (res && res.ok) {
        send({ type: "RESPOND_GENERAL", message: res.data });
      }
      return { generalResponse: res && res.ok ? res.data : null };
    })()
  ]);

  const summary: Chunk = {
    type: "SUMMARY",
    data: res.reduce((strategy, value) => ({ ...strategy, ...value }), {})
  };

  console.dir(
    { query: nl, capability: code, strategy: summary.data },
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

//   capability === "RGQ"
//     ? respondGeneral(nl).then((generalResponse) => {
//         send({ type: "RESPOND_GENERAL", message: generalResponse });
//         return { generalResponse };
//       })
//     : Promise.resolve({ generalResponse: null }),

//   remi.revise.budget(query, nl).then((res) => {
//     if (res && res.ok) {
//       send({ type: "PATCH", data: res.value });
//     }
//     return { budget: data };
//   }),

//   tasks.indoorFeatures.then((indoorFeatures) => {
//     send({
//       type: "PATCH_ARRAY",
//       key: "indoor-features",
//       value: indoorFeatures
//     });
//     return { indoorFeatures };
//   }),

//   tasks.outdoorFeatures.then((value) => {
//     c.enqueue(
//       send(
//         chunk({
//           type: "PATCH_ARRAY",
//           key: "outdoor-features",
//           value
//         })
//       )
//     );
//     return { outdoorFeatures: value };
//   }),

//   tasks.lotFeatures.then((value) => {
//     const chunk: Chunk = {
//       type: "PATCH_ARRAY",
//       key: "lot-features",
//       value
//     };
//     c.enqueue(send(chunk));
//     return { lotFeatures: value };
//   }),

//   tasks.viewTypes.then((value) => {
//     const chunk: Chunk = { type: "PATCH_ARRAY", key: "view-types", value };
//     c.enqueue(send(chunk));
//     return { viewTypes: value };
//   })
// ]);
