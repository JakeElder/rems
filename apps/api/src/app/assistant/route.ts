import { NextRequest } from "next/server";
import * as remi from "@/remi";
import {
  ErrorIntentResolution,
  IntentCode,
  IntentResolution,
  PatchReaction,
  Interaction,
  ServerRealEstateQuery,
  PatchReactionIntentResolution,
  AssistantMessage,
  CapabilityCode,
  AssistantPayload,
  OpenCloseAssistantReaction
} from "@rems/types";
import { AssistantPayloadSchema, RealEstateQuerySchema } from "@rems/schemas";
import memoize from "memoizee";
import { nlToLocation } from "../../utils/nl-to-location";
import { RemiFn } from "@/remi";
import chalk from "chalk";
import { pickBy } from "remeda";
import prettyjson from "prettyjson";
import { z } from "zod";
import dedent from "ts-dedent";
import resolveProperties from "../properties/resolve";

const { SpaceRequirements, BudgetAndAvailability, MapState } =
  RealEstateQuerySchema;

type Arrays = z.infer<typeof RealEstateQuerySchema.Arrays>;
type ArrayKey = keyof Arrays;

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

const isError = (r: IntentResolution): r is ErrorIntentResolution =>
  r.type === "ERROR";

const isReaction = (r: IntentResolution): r is PatchReactionIntentResolution =>
  r.type === "PATCH";

const encoder = new TextEncoder();

const scalarPatch = (
  group: PatchReaction["group"],
  query: ServerRealEstateQuery,
  data: Partial<ServerRealEstateQuery>
): PatchReaction => ({
  type: "PATCH",
  group,
  patch: {
    type: "SCALAR",
    data,
    diff: remi.diff.scalar(query, data)
  }
});

const arrayPatch = (
  group: PatchReaction["group"],
  query: ServerRealEstateQuery,
  key: ArrayKey,
  value: Arrays[ArrayKey]
): PatchReaction => ({
  type: "PATCH",
  group,
  patch: {
    type: "ARRAY",
    key,
    value,
    diff: remi.diff.array(query, key, value)
  }
});

type Stream = (args: AssistantPayload) => UnderlyingDefaultSource["start"];

const stream: Stream = (args) => async (c) => {
  const { input, query, chatContext } = args;

  const log = remi.logger.init(input);

  const send = (message: AssistantMessage, l: boolean = true) => {
    const chunk = encoder.encode(`${JSON.stringify(message)}\n`);
    c.enqueue(chunk);

    if (l) {
      log(message);
    }
  };

  const analyze = memoize(async () => {
    const [i, c] = await Promise.all([
      remi.capability.analyze({ input, query, chatContext }),
      remi.capability.identify(input)
    ]);

    if (!i.ok || !c.ok) {
      console.log(i, c);
      throw new Error();
    }

    const capability = remi.terse.capability(c.data);
    const intents = remi.terse.intents(i.data);

    send({ type: "ANALYSIS", capability, intents });
    return { intents, capability };
  });

  analyze();

  const resolve = async <T extends RemiFn>(
    intent: IntentCode,
    fn: T,
    process: (
      res: Extract<Awaited<ReturnType<T>>, { ok: true }>["data"]
    ) => Promise<PatchReaction | null>
  ): Promise<IntentResolution> => {
    const { intents, capability } = await analyze();

    const OP_CAPABILITIES: CapabilityCode[] = [
      "NEW_QUERY",
      "CLEAR_QUERY",
      "REFINE_QUERY"
    ];

    if (!intents.includes(intent) || !OP_CAPABILITIES.includes(capability)) {
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

    send({ type: "REACTION", reaction });
    return { type: "PATCH", intent, reaction };
  };

  const resolutions = await Promise.all([
    /*
     * Location
     */
    resolve(
      "REFINE_LOCATION",
      () => remi.refine.location({ input, chatContext }),
      async ({ origin }) => {
        if (!origin) return null;

        const l = await nlToLocation(origin);
        if (!l) return null;

        return scalarPatch("LOCATION", query, {
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
      async (page) => (page ? scalarPatch("PAGE", query, { page }) : null)
    ),

    /*
     * Sort
     */
    resolve(
      "REFINE_SORT",
      () => remi.refine.sort(input, query["sort"]),
      async (sort) => (sort ? scalarPatch("SORT", query, { sort }) : null)
    ),

    /*
     * Space Requirements
     */
    resolve(
      "REFINE_SPACE_REQUIREMENTS",
      () =>
        remi.refine.spaceRequirements(input, SpaceRequirements.parse(query)),
      async (props) => scalarPatch("SPACE_REQUIREMENTS", query, defined(props))
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
      async (props) =>
        scalarPatch("BUDGET_AND_AVAILABILITY", query, defined(props))
    ),

    /*
     * Map State
     */
    resolve(
      "REFINE_MAP_STATE",
      () => remi.refine.mapState(input, MapState.parse(query)),
      async (props) => scalarPatch("MAP_STATE", query, defined(props))
    ),

    /**
     * Indoor Features
     */
    resolve(
      "REFINE_INDOOR_FEATURES",
      () => remi.refine.indoorFeatures(input, query["indoor-features"]),
      async (res) =>
        arrayPatch("INDOOR_FEATURES", query, "indoor-features", res)
    ),

    /**
     * Outdoor Features
     */
    resolve(
      "REFINE_OUTDOOR_FEATURES",
      () => remi.refine.outdoorFeatures(input, query["outdoor-features"]),
      async (res) =>
        arrayPatch("OUTDOOR_FEATURES", query, "outdoor-features", res)
    ),

    /**
     * Lot Features
     */
    resolve(
      "REFINE_LOT_FEATURES",
      () => remi.refine.lotFeatures(input, query["lot-features"]),
      async (res) => arrayPatch("LOT_FEATURES", query, "lot-features", res)
    ),

    /**
     * Property Types
     */
    resolve(
      "REFINE_PROPERTY_TYPES",
      () => remi.refine.propertyTypes(input, query["property-types"]),
      async (res) => arrayPatch("PROPERTY_TYPES", query, "property-types", res)
    ),

    /**
     * View Types
     */
    resolve(
      "REFINE_VIEW_TYPES",
      () => remi.refine.viewTypes(input, query["view-types"]),
      async (res) => arrayPatch("VIEW_TYPES", query, "view-types", res)
    )
  ]);

  const { capability } = await analyze();

  if (
    capability === "REFINE_QUERY" ||
    capability === "NEW_QUERY" ||
    capability === "CLEAR_QUERY"
  ) {
    const reactions = resolutions.filter(isReaction).map((i) => i.reaction);

    const summary: Interaction = {
      type: capability,
      chatContext,
      input,
      analysis: await analyze(),
      reactions
    };

    send({ type: "SUMMARY", summary });
    const res = await remi.capability.summarize(summary);

    if (res.ok) {
      send({
        type: "REACTION",
        reaction: { type: "LANGUAGE_BASED", message: res.data }
      });
    } else {
      console.log(res.error);
    }
  }

  if (capability === "RESPOND_GENERAL_QUERY") {
    const properties = await resolveProperties(query);
    const res = await remi.capability.respondGeneral({
      chatContext,
      input,
      query,
      properties: properties.pagination,
      capabilities: remi.capabilities
    });
    if (res.ok) {
      send({
        type: "REACTION",
        reaction: { type: "LANGUAGE_BASED", message: res.data }
      });
    }
  }

  if (capability === "OPEN_ASSISTANT") {
    const reaction: OpenCloseAssistantReaction = {
      type: "OPEN_CLOSE_ASSISTANT",
      open: true
    };

    send({
      type: "REACTION",
      reaction: { type: "OPEN_CLOSE_ASSISTANT", open: true }
    });

    const summary: Interaction = {
      type: capability,
      chatContext,
      input,
      analysis: await analyze(),
      reactions: [reaction]
    };

    send({ type: "SUMMARY", summary });
    const res = await remi.capability.summarize(summary);

    if (res.ok) {
      send({
        type: "REACTION",
        reaction: { type: "LANGUAGE_BASED", message: res.data }
      });
    } else {
      console.log(res.error);
    }
  }

  send({ type: "UPDATE", phase: "COMPLETE" });

  const errors = resolutions.filter(isError).map(
    (res) => dedent`
       ${chalk.red(res.intent)}
       ${prettyjson.render(res.error)}
     `
  );

  console.log("\n\n");
  console.log(errors.join("\n\n"));

  c.close();
};

export async function POST(req: NextRequest) {
  const payload = AssistantPayloadSchema.parse(await req.json());

  return new Response(new ReadableStream({ start: stream(payload) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
