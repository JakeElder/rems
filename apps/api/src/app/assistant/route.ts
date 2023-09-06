import { NextRequest } from "next/server";
import * as remi from "@/remi";
import {
  IntentCode,
  IntentResolution,
  PatchArrayReaction,
  PatchReactionIntentResolution,
  PatchScalarReaction,
  QueryRefinementSummary,
  Reaction,
  RealEstateQuery
} from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import memoize from "memoizee";
import { nlToLocation } from "../../utils/nl-to-location";
import { RemiFn } from "@/remi";
import chalk from "chalk";
import { pickBy, pick } from "remeda";
import { diffString } from "json-diff";
import prettyjson from "prettyjson";
import widestLine from "widest-line";
import { z } from "zod";

const { SpaceRequirements, BudgetAndAvailability, MapState } =
  RealEstateQuerySchema;

type Arrays = z.infer<typeof RealEstateQuerySchema.Arrays>;
type ArrayKey = keyof Arrays;

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

type Stream = (
  nl: string,
  query: RealEstateQuery
) => UnderlyingDefaultSource["start"];

const encoder = new TextEncoder();

const scalarPatch = (data: Partial<RealEstateQuery>): PatchScalarReaction => ({
  type: "PATCH_SCALAR",
  patch: data
});

const arrayPatch = (
  key: ArrayKey,
  data: Arrays[ArrayKey]
): PatchArrayReaction => ({ type: "PATCH_ARRAY", key: key, value: data });

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

  const capability = memoize(async () => {
    const res = await remi.capability.identify(input);
    if (!res?.ok) throw new Error();
    return res.data;
  });

  const resolve = async <T extends RemiFn>(
    intent: IntentCode,
    fn: T,
    process: (
      res: Extract<Awaited<ReturnType<T>>, { ok: true }>["data"]
    ) => Promise<Reaction | null>
  ): Promise<IntentResolution> => {
    if (!(await intends(intent))) {
      return { intent, type: "NOOP" };
    }

    const res = await fn();

    if (!res.ok) {
      console.log();
      console.log(chalk.red(`<ERROR: ${intent}>`));
      console.dir(res.error, { colors: true, depth: null });
      console.log(chalk.red(`<ERROR: ${intent}>`));
      console.log();
      return { intent, type: "ERROR" };
    }

    const reaction = await process(res.data);
    if (!reaction) {
      return { intent, type: "NOOP" };
    }
    send(reaction);

    return { intent, type: "PATCH", reaction };
  };

  const intends = async (intent: IntentCode) =>
    remi.terse.intents(await intents()).includes(intent);

  const res = await Promise.all([
    /*
     * Location
     */
    resolve(
      "REFINE_LOCATION",
      () => remi.refine.location(input),
      async ({ origin }) => {
        if (!origin) return null;

        const l = await nlToLocation(origin);
        if (!l) return null;

        return scalarPatch({
          "origin-lat": l.lat,
          "origin-lng": l.lng,
          "origin-id": l.placeId
        });
      }
    ),

    /*
     * Page
     */
    resolve(
      "REFINE_PAGE",
      () => remi.refine.page(input, query["page"]),
      async (page) => (page ? scalarPatch({ page }) : null)
    ),

    /*
     * Sort
     */
    resolve(
      "REFINE_SORT",
      () => remi.refine.sort(input, query["sort"]),
      async (sort) => (sort ? scalarPatch({ sort }) : null)
    ),

    /*
     * Space Requirements
     */
    resolve(
      "REFINE_SPACE_REQUIREMENTS",
      () =>
        remi.refine.spaceRequirements(input, SpaceRequirements.parse(query)),
      async (props) => scalarPatch(defined(props))
    ),

    /*
     * Budget & Availability
     */
    resolve(
      "REFINE_BUDGET_AVAILABILITY",
      () =>
        remi.refine.budgetAndAvailability(
          input,
          BudgetAndAvailability.parse(query)
        ),
      async (props) => scalarPatch(defined(props))
    ),

    /*
     * Map State
     */
    resolve(
      "REFINE_MAP_STATE",
      () => remi.refine.mapState(input, MapState.parse(query)),
      async (props) => scalarPatch(defined(props))
    ),

    /**
     * Indoor Features
     */
    resolve(
      "REFINE_INDOOR_FEATURES",
      () => remi.refine.indoorFeatures(input, query["indoor-features"]),
      async (res) => arrayPatch("indoor-features", res)
    ),

    /**
     * Outdoor Features
     */
    resolve(
      "REFINE_OUTDOOR_FEATURES",
      () => remi.refine.outdoorFeatures(input, query["outdoor-features"]),
      async (res) => arrayPatch("outdoor-features", res)
    ),

    /**
     * Lot Features
     */
    resolve(
      "REFINE_LOT_FEATURES",
      () => remi.refine.lotFeatures(input, query["lot-features"]),
      async (res) => arrayPatch("lot-features", res)
    ),

    /**
     * Property Types
     */
    resolve(
      "REFINE_PROPERTY_TYPES",
      () => remi.refine.propertyTypes(input, query["property-types"]),
      async (res) => arrayPatch("property-types", res)
    ),

    /**
     * View Types
     */
    resolve(
      "REFINE_VIEW_TYPES",
      () => remi.refine.viewTypes(input, query["view-types"]),
      async (res) => arrayPatch("view-types", res)
    )
  ]);

  const summary: QueryRefinementSummary = {
    input,
    intents: remi.terse.intents(await intents()),
    resolutions: res
  };

  summarise(summary, query);

  c.close();
};

const summarise = (summary: QueryRefinementSummary, query: RealEstateQuery) => {
  const title = chalk.blue("Summary");
  const meta = prettyjson.render({
    input: summary.input,
    intents: summary.intents
  });

  const underline = chalk
    .gray(`-`)
    .repeat(Math.max(widestLine(meta), title.length));

  console.log();
  console.log(underline);
  console.log(title);
  console.log(underline);
  console.log();
  console.log(meta);
  console.log();

  const isActionable = (
    r: IntentResolution
  ): r is PatchReactionIntentResolution => r.type === "PATCH";

  const resolutions = summary.resolutions.filter(isActionable);

  resolutions.forEach((res) => {
    console.log(underline);
    console.log(chalk.yellow(res.intent));
    console.log(underline);

    if (res.reaction.type === "PATCH_SCALAR") {
      console.log(
        diffString(
          pick(query, Object.keys(res.reaction.patch) as any),
          res.reaction.patch
        )
      );
    }

    if (res.reaction.type === "PATCH_ARRAY") {
      console.log(diffString(query[res.reaction.key], res.reaction.value));
    }
  });

  console.log();
};

export async function POST(req: NextRequest) {
  const data = await req.json();
  const query = RealEstateQuerySchema.URL.parse(data.query);

  return new Response(new ReadableStream({ start: stream(data.nl, query) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
