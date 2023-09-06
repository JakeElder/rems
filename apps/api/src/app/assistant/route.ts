import { NextRequest } from "next/server";
import * as remi from "@/remi";
import {
  ErrorIntentResolution,
  IntentCode,
  IntentResolution,
  PatchArrayReaction,
  PatchReaction,
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
import dedent from "ts-dedent";

const { SpaceRequirements, BudgetAndAvailability, MapState } =
  RealEstateQuerySchema;

type Arrays = z.infer<typeof RealEstateQuerySchema.Arrays>;
type ArrayKey = keyof Arrays;

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

const encoder = new TextEncoder();

const scalarPatch = (data: Partial<RealEstateQuery>): PatchScalarReaction => ({
  type: "PATCH_SCALAR",
  patch: data
});

const arrayPatch = (
  key: ArrayKey,
  data: Arrays[ArrayKey]
): PatchArrayReaction => ({ type: "PATCH_ARRAY", key: key, value: data });

type Stream = (
  nl: string,
  query: RealEstateQuery
) => UnderlyingDefaultSource["start"];

const stream: Stream = (input, query) => async (c) => {
  // summarise(require("../../fixtures/summary").default, query);
  // c.close();
  // return;

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

    if (
      remi.terse.capability(res.data) === "NEW_QUERY" ||
      remi.terse.capability(res.data) === "REFINE_QUERY"
    ) {
      send({
        type: "UPDATE_STATE",
        value: {
          name: "REACTING",
          capability: remi.terse.capability(res.data)
        }
      });
    }

    return res.data;
  });

  capability();

  const resolve = async <T extends RemiFn>(
    intent: IntentCode,
    fn: T,
    process: (
      res: Extract<Awaited<ReturnType<T>>, { ok: true }>["data"]
    ) => Promise<PatchReaction | null>
  ): Promise<IntentResolution> => {
    if (!(await intends(intent))) {
      return { type: "NOOP", intent };
    }

    const res = await fn();
    if (!res.ok) {
      return { type: "ERROR", intent, error: res.error };
    }

    const reaction = await process(res.data);
    if (!reaction) {
      return { type: "NOOP", intent };
    }

    await capability();

    send(reaction);
    return { type: "PATCH", intent, reaction };
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
    capability: remi.terse.capability(await capability()),
    resolutions: res
  };

  summarise(summary, query);

  c.close();
};

const isPatch = (r: IntentResolution): r is PatchReactionIntentResolution =>
  r.type === "PATCH";

const isError = (r: IntentResolution): r is ErrorIntentResolution =>
  r.type === "ERROR";

const summarise = (summary: QueryRefinementSummary, query: RealEstateQuery) => {
  const title = chalk.blue("Summary");
  const meta = prettyjson.render({
    input: summary.input,
    intents: summary.intents,
    capability: summary.capability
  });

  const line = chalk.gray(`-`).repeat(Math.max(widestLine(meta), title.length));

  const diff = (res: PatchReactionIntentResolution) => {
    const keys = (obj: any): any => Object.keys(obj);

    const [before, after] =
      res.reaction.type === "PATCH_SCALAR"
        ? [pick(query, keys(res.reaction.patch)), res.reaction.patch]
        : [query[res.reaction.key], res.reaction.value];

    const string = diffString(before, after);

    if (string) {
      return string.replace(/\n+$/g, "");
    }

    return chalk.gray(JSON.stringify(after));
  };

  const resolutions = summary.resolutions.filter(isPatch).map(
    (res) => dedent`
       ${line}
       ${chalk.yellow(res.intent)}
       ${line}
       ${diff(res)}
     `
  );

  const errors = summary.resolutions.filter(isError).map(
    (res) => dedent`
       ${line}
       ${chalk.red(res.intent)}
       ${line}
       ${prettyjson.render(res.error)}
     `
  );

  console.log();
  console.log();
  console.log(line);
  console.log(title);
  console.log(line);
  console.log();
  console.log(meta);
  console.log();
  console.log(resolutions.join("\n\n"));
  console.log();
  console.log(errors.join("\n\n"));
};

export async function POST(req: NextRequest) {
  const data = await req.json();
  const query = RealEstateQuerySchema.URL.parse(data.query);

  return new Response(new ReadableStream({ start: stream(data.nl, query) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
