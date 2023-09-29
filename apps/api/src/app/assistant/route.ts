import { NextRequest } from "next/server";
import * as remi from "@/remi";
import {
  ErrorIntentResolution,
  IntentCode,
  IntentResolution,
  ServerRealEstateQuery,
  CapabilityCode,
  AssistantPayload,
  AssistantTimelineEvent,
  AssistantEvent,
  Patch
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
import uuid from "short-uuid";

const { SpaceRequirements, BudgetAndAvailability, MapState } =
  RealEstateQuerySchema;

type Arrays = z.infer<typeof RealEstateQuerySchema.Arrays>;
type ArrayKey = keyof Arrays;

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

const isError = (r: IntentResolution): r is ErrorIntentResolution =>
  r.type === "ERROR";

const encoder = new TextEncoder();

const scalarPatch = (
  group: Patch["group"],
  query: ServerRealEstateQuery,
  data: Partial<ServerRealEstateQuery>
): Patch => ({
  type: "SCALAR",
  group,
  data,
  diff: remi.diff.scalar(query, data)
});

const arrayPatch = (
  group: Patch["group"],
  query: ServerRealEstateQuery,
  key: ArrayKey,
  value: Arrays[ArrayKey]
): Patch => ({
  type: "ARRAY",
  group,
  key,
  value,
  diff: remi.diff.array(query, key, value)
});

type Stream = (args: AssistantPayload) => UnderlyingDefaultSource["start"];

const stream: Stream = (args) => async (c) => {
  const { timeline, query } = args;

  const log = remi.logger.init(timeline);

  const send = (event: AssistantEvent, outputToLog: boolean = true) => {
    const timelineEvent: AssistantTimelineEvent = {
      id: uuid.generate(),
      role: "ASSISTANT",
      date: Date.now(),
      event
    };

    const chunk = encoder.encode(`${JSON.stringify(timelineEvent)}\n`);
    c.enqueue(chunk);

    if (outputToLog) {
      log(event);
    }
  };

  const analyze = memoize(async () => {
    const [i, c] = await Promise.all([
      remi.capability.analyze({ timeline, query }),
      remi.capability.identify({ timeline })
    ]);

    if (!i.ok || !c.ok) {
      console.log(i, c);
      throw new Error();
    }

    const capability = remi.terse.capability(c.data);
    const intents = remi.terse.intents(i.data);

    send({
      type: "ANALYSIS_PERFORMED",
      analysis: { capability, intents }
    });

    return { intents, capability };
  });

  analyze();

  const resolve = async <T extends RemiFn>(
    intent: IntentCode,
    fn: T,
    process: (
      res: Extract<Awaited<ReturnType<T>>, { ok: true }>["data"]
    ) => Promise<Patch | null>
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

    const patch = await process(res.data);

    if (!patch) {
      return { type: "NOOP", intent };
    }

    send({ type: "PATCH", patch });
    return { type: "PATCH", intent, patch };
  };

  const resolutions = await Promise.all([
    /*
     * Location
     */
    resolve(
      "REFINE_LOCATION",
      () => remi.refine.location({ timeline }),
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
      () => remi.refine.page({ timeline, current: query["page"] }),
      async (page) => (page ? scalarPatch("PAGE", query, { page }) : null)
    ),

    /*
     * Sort
     */
    resolve(
      "REFINE_SORT",
      () => remi.refine.sort({ timeline, current: query["sort"] }),
      async (sort) => (sort ? scalarPatch("SORT", query, { sort }) : null)
    ),

    /*
     * Space Requirements
     */
    resolve(
      "REFINE_SPACE_REQUIREMENTS",
      () =>
        remi.refine.spaceRequirements({
          timeline,
          current: SpaceRequirements.parse(query)
        }),
      async (props) => scalarPatch("SPACE_REQUIREMENTS", query, defined(props))
    ),

    /*
     * Budget & Availability
     */
    resolve(
      "REFINE_BUDGET_AVAILABILITY",
      () =>
        remi.refine.budgetAndAvailability({
          timeline,
          current: BudgetAndAvailability.parse(query)
        }),
      async (props) =>
        scalarPatch("BUDGET_AND_AVAILABILITY", query, defined(props))
    ),

    /*
     * Map State
     */
    resolve(
      "REFINE_MAP_STATE",
      () => remi.refine.mapState({ timeline, current: MapState.parse(query) }),
      async (props) => scalarPatch("MAP_STATE", query, defined(props))
    ),

    /**
     * Indoor Features
     */
    resolve(
      "REFINE_INDOOR_FEATURES",
      () =>
        remi.refine.indoorFeatures({
          timeline,
          current: query["indoor-features"]
        }),
      async (res) =>
        arrayPatch("INDOOR_FEATURES", query, "indoor-features", res)
    ),

    /**
     * Outdoor Features
     */
    resolve(
      "REFINE_OUTDOOR_FEATURES",
      () =>
        remi.refine.outdoorFeatures({
          timeline,
          current: query["outdoor-features"]
        }),
      async (res) =>
        arrayPatch("OUTDOOR_FEATURES", query, "outdoor-features", res)
    ),

    /**
     * Lot Features
     */
    resolve(
      "REFINE_LOT_FEATURES",
      () =>
        remi.refine.lotFeatures({
          timeline,
          current: query["lot-features"]
        }),
      async (res) => arrayPatch("LOT_FEATURES", query, "lot-features", res)
    ),

    /**
     * Property Types
     */
    resolve(
      "REFINE_PROPERTY_TYPES",
      () =>
        remi.refine.propertyTypes({
          timeline,
          current: query["property-types"]
        }),
      async (res) => arrayPatch("PROPERTY_TYPES", query, "property-types", res)
    ),

    /**
     * View Types
     */
    resolve(
      "REFINE_VIEW_TYPES",
      () => remi.refine.viewTypes({ timeline, current: query["view-types"] }),
      async (res) => arrayPatch("VIEW_TYPES", query, "view-types", res)
    )
  ]);

  const { capability } = await analyze();

  if (
    capability === "REFINE_QUERY" ||
    capability === "NEW_QUERY" ||
    capability === "CLEAR_QUERY"
  ) {
    // const res = await remi.capability.summarize(summary);
    // if (res.ok) {
    //   send({
    //     type: "REACTION",
    //     reaction: { type: "LANGUAGE_BASED", message: res.data }
    //   });
    // } else {
    //   console.log(res.error);
    // }
  }

  if (capability === "RESPOND_GENERAL_QUERY") {
    const res = await remi.capability.respondGeneral({
      timeline,
      query,
      capabilities: remi.capabilities
    });
    if (res.ok) {
      send({ type: "LANGUAGE_BASED", message: res.data });
    }
  }

  send({ type: "YIELD" });

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
