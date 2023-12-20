import { RemiFn } from "@/remi/types";
import * as utils from "@/remi/utils";
import * as fn from "@/remi/fn";
import * as refine from "@/remi/refine";
import { NextRequest } from "next/server";
import {
  IntentCode,
  AssistantPayload,
  Analysis,
  NlLocationSource
} from "@rems/types";
import { AssistantPayloadSchema } from "@rems/schemas";
import memoize from "memoizee";
import {
  AppAction,
  commitRealEstateQuery,
  noop,
  registerAnalysis,
  registerIntentResolutionError,
  returnControl,
  setLocationSource
} from "@rems/state/app/actions";
import resolveLocationSource, {
  resolveLocationSourceOrFail
} from "../../utils/resolve-location-source";

type Stream = (args: AssistantPayload) => UnderlyingDefaultSource["start"];

// const defined = (obj: Record<string, any>) =>
//   pickBy(obj, (v) => typeof v !== "undefined");

const encoder = new TextEncoder();

const stream: Stream = (args) => async (c) => {
  const { state } = args;

  const act = (e: AppAction) => {
    const chunk = encoder.encode(`${JSON.stringify(e)}\n`);
    c.enqueue(chunk);
    return e;
  };

  const { locationSource } = state.slices.realEstateQuery;
  const locationResolution = await resolveLocationSourceOrFail(locationSource);

  const analyze = memoize(async () => {
    const res = await fn.identifyIntents({
      timeline: state.timeline,
      currentQuery: state.slices.realEstateQuery,
      currentLocation: {
        source: state.slices.realEstateQuery.locationSource,
        resolution: locationResolution
      }
    });

    if (!res.ok) {
      console.log(res);
      throw new Error();
    }

    const intents = utils.terse.intents(res.data);
    const analysis: Analysis = { intents };

    act(registerAnalysis(analysis));

    return analysis;
  });

  analyze();

  const resolve = async <T extends RemiFn>(
    intent: IntentCode,
    fn: T,
    process: (
      res: Extract<Awaited<ReturnType<T>>, { ok: true }>["data"]
    ) => Promise<AppAction>
  ): Promise<AppAction> => {
    const { intents } = await analyze();
    if (!intents.includes(intent)) {
      return act(noop());
    }

    try {
      const res = await fn();

      if (!res.ok) {
        return act(
          registerIntentResolutionError({
            intent,
            error: res.error
          })
        );
      }

      return act(await process(res.data));
    } catch (e) {
      return act(
        registerIntentResolutionError({
          intent,
          error: e
        })
      );
    }
  };

  await Promise.all([
    /*
     * Location
     */
    resolve(
      "REFINE_LOCATION",
      () => refine.location({ timeline: state.timeline }),
      async ({ description, radius }) => {
        if (!description)
          return registerIntentResolutionError({
            intent: "REFINE_LOCATION"
          });

        const parsed = await fn.parseLocationDescription(description);
        if (!parsed.ok) {
          return registerIntentResolutionError({
            intent: "REFINE_LOCATION",
            error: parsed.error
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
          return registerIntentResolutionError({
            intent: "REFINE_LOCATION",
            error: "Couldn't resolve location"
          });
        }

        return setLocationSource({
          role: "ASSISTANT",
          data: source
        });
      }
    )
  ]);

  // const resolutions = await Promise.all([
  //   /*
  //    * Location
  //    */
  //   resolve(
  //     "REFINE_LOCATION",
  //     () => refine.location({ timeline }),
  //     async ({ description, radius }) => {
  //       if (!description) return null;

  //       const parsed = await fn.parseLocationDescription(description);
  //       if (!parsed.ok) {
  //         return event("SYSTEM", {
  //           type: "INTENT_RESOLUTION_ERROR",
  //           intent: "REFINE_LOCATION",
  //           error: "Couldn't resolve location"
  //         });
  //       }

  //       const source: NlLocationSource = {
  //         type: "NL",
  //         description: parsed.data.description,
  //         radius: radius || null,
  //         geospatialOperator: parsed.data.geospatialOperator
  //       };

  //       const resolutionRes = await resolveLocationSource(source);

  //       if (!resolutionRes.ok) {
  //         return event("SYSTEM", {
  //           type: "INTENT_RESOLUTION_ERROR",
  //           intent: "REFINE_LOCATION",
  //           error: "Couldn't resolve location"
  //         });
  //       }

  //       return event("ASSISTANT", {
  //         type: "UPDATE_LOCATION",
  //         prev: location,
  //         next: {
  //           source,
  //           resolution: resolutionRes.resolution
  //         }
  //       });
  //     }
  //   ),

  //   /*
  //    * Page
  //    */
  //   resolve(
  //     "REFINE_PAGE",
  //     () => refine.page({ timeline, current: query.pageAndSort.page }),
  //     async (page) =>
  //       page
  //         ? event("ASSISTANT", {
  //             type: "PATCH",
  //             patch: scalarPatch("PAGE", query, { page })
  //           })
  //         : null
  //   ),

  //   /*
  //    * Sort
  //    */
  //   resolve(
  //     "REFINE_SORT",
  //     () => refine.sort({ timeline, current: query["sort"] }),
  //     async (sort) =>
  //       sort
  //         ? event("ASSISTANT", {
  //             type: "PATCH",
  //             patch: scalarPatch("PAGE", query, { sort })
  //           })
  //         : null
  //   ),

  //   /*
  //    * Space Requirements
  //    */
  //   resolve(
  //     "REFINE_SPACE_REQUIREMENTS",
  //     () =>
  //       refine.spaceRequirements({
  //         timeline,
  //         current: SpaceRequirements.parse(query)
  //       }),
  //     async (props) =>
  //       event("ASSISTANT", {
  //         type: "PATCH",
  //         patch: scalarPatch("SPACE_REQUIREMENTS", query, defined(props))
  //       })
  //   ),

  //   /*
  //    * Budget & Availability
  //    */
  //   resolve(
  //     "REFINE_BUDGET_AVAILABILITY",
  //     () =>
  //       refine.budgetAndAvailability({
  //         timeline,
  //         current: BudgetAndAvailability.parse(query)
  //       }),
  //     async (props) =>
  //       event("ASSISTANT", {
  //         type: "PATCH",
  //         patch: scalarPatch("BUDGET_AND_AVAILABILITY", query, defined(props))
  //       })
  //   ),

  //   /**
  //    * Indoor Features
  //    */
  //   resolve(
  //     "REFINE_INDOOR_FEATURES",
  //     () =>
  //       refine.indoorFeatures({
  //         timeline,
  //         current: query["indoor-features"]
  //       }),
  //     async (res) =>
  //       event("ASSISTANT", {
  //         type: "PATCH",
  //         patch: arrayPatch("INDOOR_FEATURES", query, "indoor-features", res)
  //       })
  //   ),

  //   /**
  //    * Outdoor Features
  //    */
  //   resolve(
  //     "REFINE_OUTDOOR_FEATURES",
  //     () =>
  //       refine.outdoorFeatures({
  //         timeline,
  //         current: query["outdoor-features"]
  //       }),
  //     async (res) =>
  //       event("ASSISTANT", {
  //         type: "PATCH",
  //         patch: arrayPatch("OUTDOOR_FEATURES", query, "outdoor-features", res)
  //       })
  //   ),

  //   /**
  //    * Lot Features
  //    */
  //   resolve(
  //     "REFINE_LOT_FEATURES",
  //     () =>
  //       refine.lotFeatures({
  //         timeline,
  //         current: query["lot-features"]
  //       }),
  //     async (res) =>
  //       event("ASSISTANT", {
  //         type: "PATCH",
  //         patch: arrayPatch("LOT_FEATURES", query, "lot-features", res)
  //       })
  //   ),

  //   /**
  //    * Property Types
  //    */
  //   resolve(
  //     "REFINE_PROPERTY_TYPES",
  //     () =>
  //       refine.propertyTypes({
  //         timeline,
  //         current: query["property-types"]
  //       }),
  //     async (res) =>
  //       event("ASSISTANT", {
  //         type: "PATCH",
  //         patch: arrayPatch("PROPERTY_TYPES", query, "property-types", res)
  //       })
  //   ),

  //   /**
  //    * View Types
  //    */
  //   resolve(
  //     "REFINE_VIEW_TYPES",
  //     () => refine.viewTypes({ timeline, current: query["view-types"] }),
  //     async (res) =>
  //       event("ASSISTANT", {
  //         type: "PATCH",
  //         patch: arrayPatch("VIEW_TYPES", query, "view-types", res)
  //       })
  //   )
  // ]);

  // const analysis = await analyze();

  // act(
  //   handleAssistantYield({
  //     state:
  //     message: "done"
  //   })
  // );

  await analyze();

  act(commitRealEstateQuery());
  act(returnControl());

  c.close();
};

export async function POST(req: NextRequest) {
  const { state } = AssistantPayloadSchema.parse(await req.json());

  return new Response(new ReadableStream({ start: stream({ state }) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
