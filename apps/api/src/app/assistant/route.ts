import { RemiFn } from "@/remi/types";
import * as utils from "@/remi/utils";
import * as fn from "@/remi/fn";
import * as refine from "@/remi/refine";
import { $event } from "@/remi/wrappers";
import { capabilities } from "@/remi";
import { realEstateQueryStore } from "@rems/state/stores";
import { NextRequest } from "next/server";
import {
  IntentCode,
  CapabilityCode,
  AssistantPayload,
  TimelineEvent,
  Analysis,
  NlLocationSource
} from "@rems/types";
import { AssistantPayloadSchema } from "@rems/schemas";
import memoize from "memoizee";
import resolveLocationSource from "../../utils/resolve-location-source";
import { pickBy } from "remeda";

type IntentResolution = TimelineEvent | null;

const isTimelineEventResolution = (r: IntentResolution): r is TimelineEvent =>
  r !== null;

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

const encoder = new TextEncoder();

type Stream = (args: AssistantPayload) => UnderlyingDefaultSource["start"];

const stream: Stream = (args) => async (c) => {
  const { timeline, query, location } = args;

  const log = utils.logger.init(timeline);

  const send = (e: TimelineEvent, outputToLog: boolean = true) => {
    const chunk = encoder.encode(`${JSON.stringify(e)}\n`);
    c.enqueue(chunk);

    if (outputToLog && (e.role === "ASSISTANT" || e.role === "SYSTEM")) {
      log(e.event);
    }
  };

  const analyze = memoize(async () => {
    const i = await fn.identifyIntents({
      timeline,
      query,
      currentLocation: location
    });

    if (!i.ok) {
      console.log(i);
      throw new Error();
    }

    const primary = utils.terse.intent(i.data.primary);
    const secondary = utils.terse.intents(i.data.secondary);

    if (!primary) {
      throw new Error();
    }

    const capability = map[primary];

    if (!capability) {
      throw new Error();
    }

    const analysis: Analysis = { capability, intents: secondary };
    send($event("SYSTEM", { type: "ANALYSIS_PERFORMED", analysis }));

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
      () => refine.location({ timeline }),
      async ({ description, radius }) => {
        if (!description) return null;

        const parsed = await fn.parseLocationDescription(description);
        if (!parsed.ok) {
          return event("SYSTEM", {
            type: "INTENT_RESOLUTION_ERROR",
            intent: "REFINE_LOCATION",
            error: "Couldn't resolve location"
          });
        }

        const source: NlLocationSource = {
          type: "NL",
          description: parsed.data.description,
          radius: radius || null,
          geospatialOperator: parsed.data.geospatialOperator
        };

        const resolutionRes = await resolveLocationSource(source);

        if (!resolutionRes.ok) {
          return event("SYSTEM", {
            type: "INTENT_RESOLUTION_ERROR",
            intent: "REFINE_LOCATION",
            error: "Couldn't resolve location"
          });
        }

        return event("ASSISTANT", {
          type: "UPDATE_LOCATION",
          prev: location,
          next: {
            source,
            resolution: resolutionRes.resolution
          }
        });
      }
    ),

    /*
     * Page
     */
    resolve(
      "REFINE_PAGE",
      () => refine.page({ timeline, current: query.pageAndSort.page }),
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
      () => refine.sort({ timeline, current: query["sort"] }),
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
        refine.spaceRequirements({
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
        refine.budgetAndAvailability({
          timeline,
          current: BudgetAndAvailability.parse(query)
        }),
      async (props) =>
        event("ASSISTANT", {
          type: "PATCH",
          patch: scalarPatch("BUDGET_AND_AVAILABILITY", query, defined(props))
        })
    ),

    /**
     * Indoor Features
     */
    resolve(
      "REFINE_INDOOR_FEATURES",
      () =>
        refine.indoorFeatures({
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
        refine.outdoorFeatures({
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
        refine.lotFeatures({
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
        refine.propertyTypes({
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
      () => refine.viewTypes({ timeline, current: query["view-types"] }),
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
    const res = await fn.summarize({
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
    const res = await fn.respondGeneral({
      timeline,
      query,
      capabilities
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

  c.close();
};

export async function POST(req: NextRequest) {
  const { query, timeline, location } = AssistantPayloadSchema.parse(
    await req.json()
  );

  return new Response(
    new ReadableStream({
      start: stream({
        query,
        timeline: timeline.slice(-10),
        location
      })
    }),
    { headers: { "Content-Type": "application/json; charset=utf-8" } }
  );
}
