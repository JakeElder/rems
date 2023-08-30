import { NextRequest } from "next/server";
import * as remi from "@/remi";
import { IntentCode, Reaction, RealEstateQuery } from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import memoize from "memoizee";
import { nlToLocation } from "../../utils/nl-to-location";
import { RemiFn } from "@/remi";
import chalk from "chalk";

type Stream = (
  nl: string,
  query: RealEstateQuery
) => UnderlyingDefaultSource["start"];

const encoder = new TextEncoder();

const patch = (data: Partial<RealEstateQuery>): Reaction => ({
  type: "PATCH_QUERY",
  patch: data
});

const stream: Stream = (input, query) => async (c) => {
  const send = (data: Reaction) => {
    const chunk = encoder.encode(`${JSON.stringify(data)}\n`);
    c.enqueue(chunk);
  };

  const intents = memoize(async () => {
    const res = await remi.capability.analyze(input);
    if (!res?.ok) throw new Error();
    return res.data;
  });

  // const capability = memoize(async () => {
  //   const res = await remi.capability.identify(nl);
  //   if (!res?.ok) throw new Error();
  //   return res.data;
  // });

  const run = async <T extends RemiFn>(
    label: string,
    condition: () => Promise<boolean>,
    fn: T,
    process: (
      res: Extract<Awaited<ReturnType<T>>, { ok: true }>["data"]
    ) => Promise<Reaction | null>
  ) => {
    if (!(await condition())) return { [label]: "No-op" };

    const res = await fn();

    if (!res.ok) {
      console.log();
      console.log(chalk.red(`<ERROR: ${label}>`));
      console.dir(res.error, { colors: true, depth: null });
      console.log(chalk.red(`<ERROR: ${label}>`));
      console.log()
      return { [label]: "Error" };
    }

    const reaction = await process(res.data);
    if (reaction) send(reaction);
    return { [label]: reaction };
  };

  const intends = async (intent: IntentCode) =>
    remi.terse.intents(await intents()).includes(intent);

  const res = await Promise.all([
    /*
     * Location
     */
    run(
      "Location",
      async () => intends("REFINE_LOCATION"),
      () => remi.refine.location(input),
      async ({ origin }) => {
        if (!origin) return null;

        const l = await nlToLocation(origin);
        if (!l) return null;

        return patch({
          "origin-lat": l.lat,
          "origin-lng": l.lng,
          "origin-id": l.placeId
        });
      }
    ),

    /**
     * Indoor Features
     */
    run(
      "Indoor Features",
      async () => intends("REFINE_INDOOR_FEATURES"),
      () => remi.refine.indoorFeatures(input, query["indoor-features"]),
      async (res) => patch({ "indoor-features": res })
    ),

    /**
     * Outdoor Features
     */
    run(
      "Outdoor Features",
      async () => intends("REFINE_OUTDOOR_FEATURES"),
      () => remi.refine.outdoorFeatures(input, query["outdoor-features"]),
      async (res) => patch({ "outdoor-features": res })
    )
  ]);

  console.dir(
    {
      input,
      intents: remi.terse.intents(await intents()),
      reactions: Object.assign({}, ...res)
    },
    {
      colors: true,
      depth: null
    }
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
