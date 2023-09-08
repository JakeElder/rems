import { NextRequest } from "next/server";
import * as remi from "@/remi";
import {
  ErrorIntentResolution,
  IntentCode,
  IntentResolution,
  PatchArrayReaction,
  PatchReaction,
  PatchScalarReaction,
  Interaction,
  RealEstateQuery,
  PatchReactionIntentResolution,
  AssistantMessage
} from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import memoize from "memoizee";
import { nlToLocation } from "../../utils/nl-to-location";
import { RemiFn } from "@/remi";
import chalk from "chalk";
import { pickBy } from "remeda";
import prettyjson from "prettyjson";
import { z } from "zod";
import dedent from "ts-dedent";

const { SpaceRequirements, BudgetAndAvailability, MapState } =
  RealEstateQuerySchema;

type Arrays = z.infer<typeof RealEstateQuerySchema.Arrays>;
type ArrayKey = keyof Arrays;

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

const encoder = new TextEncoder();

const scalarPatch = (
  query: RealEstateQuery,
  patch: Partial<RealEstateQuery>
): PatchScalarReaction => ({
  type: "PATCH_SCALAR",
  patch,
  diff: remi.diff.scalar(query, patch)
});

const arrayPatch = (
  query: RealEstateQuery,
  key: ArrayKey,
  value: Arrays[ArrayKey]
): PatchArrayReaction => ({
  type: "PATCH_ARRAY",
  key,
  value,
  diff: remi.diff.array(query, key, value)
});

type Stream = (
  nl: string,
  query: RealEstateQuery
) => UnderlyingDefaultSource["start"];

const stream: Stream = (input, query) => async (c) => {
  // summarise(require("../../fixtures/summary").default, query);
  // c.close();
  // return;

  const send = (message: AssistantMessage) => {
    const chunk = encoder.encode(`${JSON.stringify(message)}\n`);
    c.enqueue(chunk);
  };

  const analyze = memoize(async () => {
    const [i, c] = await Promise.all([
      remi.capability.analyze(input),
      remi.capability.identify(input)
    ]);

    if (!i.ok || !c.ok) {
      throw new Error();
    }

    const capability = remi.terse.capability(c.data);
    const intents = remi.terse.intents(i.data);

    send({
      type: "ANALYSIS",
      data: { capability, intents }
    });

    send({
      type: "REACTION",
      reaction: {
        type: "UPDATE_STATE",
        value: { name: "REACTING", capability }
      }
    });

    return { intents, capability };
  });

  analyze();

  const intends = async (intent: IntentCode) => {
    const { intents } = await analyze();
    return intents.includes(intent);
  };

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

    await analyze();

    send({ type: "REACTION", reaction });

    if (reaction.type === "PATCH_SCALAR") {
      console.dir(reaction.diff);
    }

    if (reaction.type === "PATCH_ARRAY") {
      console.dir(reaction.diff);
    }

    return { type: "PATCH", intent, reaction };
  };

  const resolutions = await Promise.all([
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

        return scalarPatch(query, {
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
      async (page) => (page ? scalarPatch(query, { page }) : null)
    ),

    /*
     * Sort
     */
    resolve(
      "REFINE_SORT",
      () => remi.refine.sort(input, query["sort"]),
      async (sort) => (sort ? scalarPatch(query, { sort }) : null)
    ),

    /*
     * Space Requirements
     */
    resolve(
      "REFINE_SPACE_REQUIREMENTS",
      () =>
        remi.refine.spaceRequirements(input, SpaceRequirements.parse(query)),
      async (props) => scalarPatch(query, defined(props))
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
      async (props) => scalarPatch(query, defined(props))
    ),

    /*
     * Map State
     */
    resolve(
      "REFINE_MAP_STATE",
      () => remi.refine.mapState(input, MapState.parse(query)),
      async (props) => scalarPatch(query, defined(props))
    ),

    /**
     * Indoor Features
     */
    resolve(
      "REFINE_INDOOR_FEATURES",
      () => remi.refine.indoorFeatures(input, query["indoor-features"]),
      async (res) => arrayPatch(query, "indoor-features", res)
    ),

    /**
     * Outdoor Features
     */
    resolve(
      "REFINE_OUTDOOR_FEATURES",
      () => remi.refine.outdoorFeatures(input, query["outdoor-features"]),
      async (res) => arrayPatch(query, "outdoor-features", res)
    ),

    /**
     * Lot Features
     */
    resolve(
      "REFINE_LOT_FEATURES",
      () => remi.refine.lotFeatures(input, query["lot-features"]),
      async (res) => arrayPatch(query, "lot-features", res)
    ),

    /**
     * Property Types
     */
    resolve(
      "REFINE_PROPERTY_TYPES",
      () => remi.refine.propertyTypes(input, query["property-types"]),
      async (res) => arrayPatch(query, "property-types", res)
    ),

    /**
     * View Types
     */
    resolve(
      "REFINE_VIEW_TYPES",
      () => remi.refine.viewTypes(input, query["view-types"]),
      async (res) => arrayPatch(query, "view-types", res)
    )
  ]);

  const isError = (r: IntentResolution): r is ErrorIntentResolution =>
    r.type === "ERROR";

  const isReaction = (
    r: IntentResolution
  ): r is PatchReactionIntentResolution => r.type === "PATCH";

  const { capability } = await analyze();

  if (capability === "REFINE_QUERY" || capability === "NEW_QUERY") {
    const summary: Interaction = {
      type: capability,
      input,
      analysis: await analyze(),
      reactions: resolutions.filter(isReaction).map((i) => i.reaction)
    };

    send({ type: "SUMMARY", summary });
  }

  const errors = resolutions.filter(isError).map(
    (res) => dedent`
       ${chalk.red(res.intent)}
       ${prettyjson.render(res.error)}
     `
  );

  console.log(errors.join("\n\n"));

  c.close();
};

export async function POST(req: NextRequest) {
  const data = await req.json();
  const query = RealEstateQuerySchema.URL.parse(data.query);

  return new Response(new ReadableStream({ start: stream(data.nl, query) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
