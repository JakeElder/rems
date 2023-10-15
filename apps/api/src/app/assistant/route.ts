import { NextRequest } from "next/server";
import * as remi from "@/remi";
import {
  IntentCode,
  ServerRealEstateQuery,
  CapabilityCode,
  AssistantPayload,
  Patch,
  Event,
  TimelineEvent,
  IntentResolutionErrorEvent,
  Analysis
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

type IntentResolution = TimelineEvent | null;

const isTimelineEventResolution = (r: IntentResolution): r is TimelineEvent =>
  r !== null;

const isError = (r: Event): r is IntentResolutionErrorEvent =>
  r.type === "INTENT_RESOLUTION_ERROR";

const { SpaceRequirements, BudgetAndAvailability, MapState } =
  RealEstateQuerySchema;

type Arrays = z.infer<typeof RealEstateQuerySchema.Arrays>;
type ArrayKey = keyof Arrays;

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

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

const event = <T extends TimelineEvent["role"]>(
  role: T,
  event: Extract<TimelineEvent, { role: T }>["event"]
) => ({
  id: uuid.generate(),
  date: Date.now(),
  role,
  event
});

type Stream = (args: AssistantPayload) => UnderlyingDefaultSource["start"];

const stream: Stream = (args) => async (c) => {
  const { timeline, query } = args;

  const log = remi.logger.init(timeline);

  const send = (e: TimelineEvent, outputToLog: boolean = true) => {
    const chunk = encoder.encode(`${JSON.stringify(e)}\n`);
    c.enqueue(chunk);

    if (outputToLog && (e.role === "ASSISTANT" || e.role === "SYSTEM")) {
      log(e.event);
    }
  };

  const analyze = memoize(async () => {
    const i = await remi.capability.identifyIntents({ timeline, query });

    if (!i.ok) {
      console.log(i);
      throw new Error();
    }

    const primary = remi.terse.intent(i.data.primary);
    const secondary = remi.terse.intents(i.data.secondary);

    if (!primary) {
      throw new Error();
    }

    const map: Partial<Record<IntentCode, CapabilityCode>> = {
      NEW_QUERY: "NEW_QUERY",
      REFINE_QUERY: "REFINE_QUERY",
      CLEAR_QUERY: "CLEAR_QUERY",
      OBTAIN_GENERAL_INFORMATION: "RESPOND_GENERAL_QUERY",
      UNKNOWN: "INFORM_MORE_INFO_NEEDED"
    };

    const capability = map[primary];

    if (!capability) {
      throw new Error();
    }

    const analysis: Analysis = { capability, intents: secondary };
    send(event("SYSTEM", { type: "ANALYSIS_PERFORMED", analysis }));

    return analysis;
  });

  analyze();

  const resolve = async <T extends RemiFn>(
    intent: IntentCode,
    fn: T,
    process: (
      res: Extract<Awaited<ReturnType<T>>, { ok: true }>["data"]
    ) => Promise<IntentResolution>
  ): Promise<IntentResolution> => {
    const { intents, capability } = await analyze();

    const OP_CAPABILITIES: CapabilityCode[] = [
      "NEW_QUERY",
      "CLEAR_QUERY",
      "REFINE_QUERY"
    ];

    if (!intents.includes(intent) || !OP_CAPABILITIES.includes(capability)) {
      return null;
    }

    try {
      const res = await fn();

      if (!res.ok) {
        return event("SYSTEM", {
          type: "INTENT_RESOLUTION_ERROR",
          intent,
          error: res.error
        });
      }

      const e = await process(res.data);

      if (!e) {
        return null;
      }

      send(e);
      return e;
    } catch (e) {
      return event("SYSTEM", {
        type: "INTENT_RESOLUTION_ERROR",
        intent,
        error: e
      });
    }
  };

  const resolutions = await Promise.all([
    /*
     * Location
     */
    resolve(
      "REFINE_LOCATION",
      () => remi.refine.location({ timeline }),
      async ({ source, radius }) => {
        if (!source) return null;

        try {
          const l = await nlToLocation(source);
          return event("ASSISTANT", {
            type: "PATCH",
            patch: scalarPatch("LOCATION", query, {
              "origin-lat": l.lat,
              "origin-lng": l.lng,
              "origin-id": l.placeId
            })
          });
        } catch (e) {
          return event("SYSTEM", {
            type: "INTENT_RESOLUTION_ERROR",
            intent: "REFINE_LOCATION",
            error: e
          });
        }
      }
    ),

    /*
     * Page
     */
    resolve(
      "REFINE_PAGE",
      () => remi.refine.page({ timeline, current: query["page"] }),
      async (page) =>
        page
          ? event("ASSISTANT", {
              type: "PATCH",
              patch: scalarPatch("PAGE", query, { page })
            })
          : null
    ),

    /*
     * Sort
     */
    resolve(
      "REFINE_SORT",
      () => remi.refine.sort({ timeline, current: query["sort"] }),
      async (sort) =>
        sort
          ? event("ASSISTANT", {
              type: "PATCH",
              patch: scalarPatch("PAGE", query, { sort })
            })
          : null
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
      async (props) =>
        event("ASSISTANT", {
          type: "PATCH",
          patch: scalarPatch("SPACE_REQUIREMENTS", query, defined(props))
        })
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
        event("ASSISTANT", {
          type: "PATCH",
          patch: scalarPatch("BUDGET_AND_AVAILABILITY", query, defined(props))
        })
    ),

    /*
     * Map State
     */
    resolve(
      "REFINE_MAP_STATE",
      () => remi.refine.mapState({ timeline, current: MapState.parse(query) }),
      async (props) =>
        event("ASSISTANT", {
          type: "PATCH",
          patch: scalarPatch("MAP_STATE", query, defined(props))
        })
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
        event("ASSISTANT", {
          type: "PATCH",
          patch: arrayPatch("INDOOR_FEATURES", query, "indoor-features", res)
        })
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
        event("ASSISTANT", {
          type: "PATCH",
          patch: arrayPatch("OUTDOOR_FEATURES", query, "outdoor-features", res)
        })
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
      async (res) =>
        event("ASSISTANT", {
          type: "PATCH",
          patch: arrayPatch("LOT_FEATURES", query, "lot-features", res)
        })
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
      async (res) =>
        event("ASSISTANT", {
          type: "PATCH",
          patch: arrayPatch("PROPERTY_TYPES", query, "property-types", res)
        })
    ),

    /**
     * View Types
     */
    resolve(
      "REFINE_VIEW_TYPES",
      () => remi.refine.viewTypes({ timeline, current: query["view-types"] }),
      async (res) =>
        event("ASSISTANT", {
          type: "PATCH",
          patch: arrayPatch("VIEW_TYPES", query, "view-types", res)
        })
    )
  ]);

  const analysis = await analyze();

  const interactionTimeline = [
    ...timeline.slice(-3),
    event("SYSTEM", { type: "ANALYSIS_PERFORMED", analysis }),
    ...resolutions.filter(isTimelineEventResolution)
  ];

  const { capability } = analysis;

  if (
    capability === "REFINE_QUERY" ||
    capability === "NEW_QUERY" ||
    capability === "CLEAR_QUERY"
  ) {
    const res = await remi.capability.summarize({
      timeline: interactionTimeline
    });

    if (res.ok) {
      send(
        event("ASSISTANT", {
          type: "LANGUAGE_BASED",
          message: res.data
        })
      );
    } else {
      console.log(res.error);
    }
  }

  if (capability === "RESPOND_GENERAL_QUERY") {
    const res = await remi.capability.respondGeneral({
      timeline,
      query,
      capabilities: remi.capabilities
    });
    if (res.ok) {
      send(
        event("ASSISTANT", {
          type: "LANGUAGE_BASED",
          message: res.data
        })
      );
    }
  }

  send(event("SYSTEM", { type: "YIELD" }));

  const errors = interactionTimeline
    .map((te) => te.event)
    .filter(isError)
    .map(
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
  const { query, timeline } = AssistantPayloadSchema.parse(await req.json());

  return new Response(
    new ReadableStream({
      start: stream({ query, timeline: timeline.slice(-10) })
    }),
    { headers: { "Content-Type": "application/json; charset=utf-8" } }
  );
}
