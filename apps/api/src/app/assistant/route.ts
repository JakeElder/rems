import { RemiFn } from "@/remi/types";
import * as remi from "@/remi";
import * as app from "@rems/state/app";
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
  setArray,
  setAssistantWorking,
  setBudgetAndAvailability,
  setLocation,
  setPageAndSort,
  setSpaceRequirements,
  yld
} from "@rems/state/app/actions";
import resolveLocationSource, {
  resolveLocationSourceOrFail
} from "../../utils/resolve-location-source";
import { pickBy } from "remeda";

type Stream = (args: AssistantPayload) => UnderlyingDefaultSource["start"];

const defined = (obj: Record<string, any>) =>
  pickBy(obj, (v) => typeof v !== "undefined");

const encoder = new TextEncoder();

const stream: Stream = (args) => async (c) => {
  const { state: yieldedState } = args;
  const { timeline } = yieldedState;
  const query = yieldedState.slices.realEstateQuery;

  const store = app.init(yieldedState);

  const act = (action: AppAction) => {
    const chunk = encoder.encode(`${JSON.stringify(action)}\n`);
    c.enqueue(chunk);
    store.dispatch(action);
    return action;
  };

  const { locationSource } = query;
  const locationResolution = await resolveLocationSourceOrFail(locationSource);

  const analyze = memoize(async () => {
    const res = await fn.identifyIntents({
      timeline: yieldedState.timeline,
      currentQuery: query,
      currentLocation: {
        source: query.locationSource,
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

    const requiresWork = intents.some((i) => {
      const intent = remi.intents.find((si) => si.code === i)!;
      return intent.requiresWork;
    });

    if (requiresWork) {
      act(setAssistantWorking());
    }

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
      () => refine.location({ timeline }),
      async ({ description, radius }) => {
        if (!description) {
          return registerIntentResolutionError({
            intent: "REFINE_LOCATION"
          });
        }

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

        const resolutions = await Promise.all([
          resolveLocationSource(query.locationSource),
          resolveLocationSource(source)
        ]);

        if (!resolutions[0].ok || !resolutions[1].ok) {
          return registerIntentResolutionError({
            intent: "REFINE_LOCATION",
            error: "Couldn't resolve location"
          });
        }

        return setLocation({
          role: "ASSISTANT",
          data: {
            prev: {
              source: query.locationSource,
              resolution: resolutions[0].resolution
            },
            next: {
              source,
              resolution: resolutions[1].resolution
            }
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
          ? setPageAndSort({
              role: "ASSISTANT",
              data: { page }
            })
          : noop()
    ),

    /*
     * Sort
     */
    resolve(
      "REFINE_SORT",
      () => refine.sort({ timeline, current: query.pageAndSort.sort }),
      async (sort) =>
        sort
          ? setPageAndSort({
              role: "ASSISTANT",
              data: { sort }
            })
          : noop()
    ),

    /*
     * Space Requirements
     */
    resolve(
      "REFINE_SPACE_REQUIREMENTS",
      () =>
        refine.spaceRequirements({
          timeline,
          current: yieldedState.slices.realEstateQuery.space
        }),
      async (props) =>
        setSpaceRequirements({
          role: "ASSISTANT",
          data: defined(props)
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
          current: yieldedState.slices.realEstateQuery.budgetAndAvailability
        }),
      async (props) =>
        setBudgetAndAvailability({
          role: "ASSISTANT",
          data: defined(props)
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
          current: query.indoorFeatures
        }),
      async (res) =>
        setArray({
          role: "ASSISTANT",
          data: res,
          prop: "indoorFeatures",
          group: "Indoor Features"
        })
    )
  ]);

  // const resolutions = await Promise.all([

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

  const summary = await fn.summarize({
    timeline: store.getState().timeline
  });

  if (!summary.ok) {
    throw new Error();
  }

  act(
    yld({
      role: "ASSISTANT",
      state: yieldedState.slices,
      message: summary.data
    })
  );

  c.close();
};

export async function POST(req: NextRequest) {
  const { state } = AssistantPayloadSchema.parse(await req.json());

  return new Response(new ReadableStream({ start: stream({ state }) }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
