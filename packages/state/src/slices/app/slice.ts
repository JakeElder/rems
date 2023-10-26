import {
  createSlice,
  configureStore,
  PayloadAction,
  nanoid,
  DeepPartial
} from "@reduxjs/toolkit";
import defaults from "./defaults";
import * as diff from "../../diff";
import {
  AppState,
  AppStateSlices,
  AssistantPlacement,
  AssistantPlacementAction,
  AssistantTimelineEvent,
  BudgetAndAvailabilityRequirements,
  Filter,
  InputSession,
  LocationSource,
  RealEstateIndexPageAndSort,
  RealEstateQuery,
  RealEstateQueryArrayKey,
  SpaceRequirements,
  TimelineEvent,
  UserTimelineEvent
} from "@rems/types";
import extend from "deep-extend";
import { clone } from "remeda";

type ActorTimelineEvent = UserTimelineEvent | AssistantTimelineEvent;

type QueryMutationAction<T = void, E = {}> = PayloadAction<
  {
    role: ActorTimelineEvent["role"];
    data: T;
  } & E
>;

type AppStateMutationTimelineEvent = Extract<
  TimelineEvent,
  { role: "USER" | "ASSISTANT" }
>;

type AppStateMutation = Extract<
  AppStateMutationTimelineEvent["event"],
  { type: "STATE_MUTATION" }
>;

const EXPANSION_STATES: AssistantPlacement[] = [
  "MINIMISED",
  "DOCKED",
  "WINDOWED"
];

const placement = {
  expand(current: AssistantPlacement): AssistantPlacement {
    const idx = EXPANSION_STATES.indexOf(current);
    if (idx === -1) {
      return "WINDOWED";
    }
    return EXPANSION_STATES[Math.min(idx + 1, EXPANSION_STATES.length - 1)];
  },

  contract(current: AssistantPlacement): AssistantPlacement {
    const idx = EXPANSION_STATES.indexOf(current);
    if (idx === -1) {
      return "DOCKED";
    }
    return EXPANSION_STATES[Math.max(idx - 1, 0)];
  },

  resolve(
    action: AssistantPlacementAction,
    prev: AssistantPlacement
  ): AssistantPlacement {
    switch (action) {
      case "EXPAND":
        return placement.expand(prev);
      case "CONTRACT":
        return placement.contract(prev);
      case "FRAME_LEFT":
        return "LEFT";
      case "FRAME_RIGHT":
        return "RIGHT";
      case "MINIMIZE":
        return "MINIMISED";
      case "MAXIMIZE":
        return "WINDOWED";
      default:
        return prev;
    }
  }
};

const $event = ({
  role,
  prev,
  next,
  patch
}: Pick<AppStateMutationTimelineEvent, "role"> &
  AppStateMutation["mutation"]): AppStateMutationTimelineEvent => ({
  id: nanoid(),
  date: Date.now(),
  role,
  event: {
    type: "STATE_MUTATION",
    mutation: {
      next,
      prev,
      patch
    }
  }
});

const setBudgetAndAvailability = (
  state: AppState,
  action: QueryMutationAction<Partial<BudgetAndAvailabilityRequirements>>
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    stagedRealEstateQuery: {
      ...prev.stagedRealEstateQuery,
      budgetAndAvailability: {
        ...prev.stagedRealEstateQuery.budgetAndAvailability,
        ...action.payload.data
      }
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "SCALAR",
      group: "Budget & Availability",
      data: action.payload.data,
      diff: diff.scalar(
        defaults().slices.stagedRealEstateQuery.budgetAndAvailability,
        prev.stagedRealEstateQuery.budgetAndAvailability,
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const setLocationSource = (
  state: AppState,
  action: QueryMutationAction<LocationSource>
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    stagedRealEstateQuery: {
      ...prev.stagedRealEstateQuery,
      locationSource: action.payload.data
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "SCALAR",
      group: "Location",
      data: action.payload.data,
      diff: diff.scalar(
        defaults().slices.stagedRealEstateQuery.locationSource,
        prev.stagedRealEstateQuery.locationSource,
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const setPageAndSort = (
  state: AppState,
  action: QueryMutationAction<Partial<RealEstateIndexPageAndSort>>
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    stagedRealEstateQuery: {
      ...prev.stagedRealEstateQuery,
      pageAndSort: {
        ...prev.stagedRealEstateQuery.pageAndSort,
        ...action.payload.data
      }
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "SCALAR",
      group: "Page & Sort",
      data: action.payload.data,
      diff: diff.scalar(
        defaults().slices.stagedRealEstateQuery.pageAndSort,
        prev.stagedRealEstateQuery.pageAndSort,
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const setSpace = (
  state: AppState,
  action: QueryMutationAction<Partial<SpaceRequirements>>
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    stagedRealEstateQuery: {
      ...prev.stagedRealEstateQuery,
      space: {
        ...prev.stagedRealEstateQuery.space,
        ...action.payload.data
      }
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "SCALAR",
      group: "Space Requirements",
      data: action.payload.data,
      diff: diff.scalar(
        defaults().slices.stagedRealEstateQuery.space,
        prev.stagedRealEstateQuery.space,
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const setArray = (
  state: AppState,
  action: QueryMutationAction<
    Filter[],
    {
      group: string;
      prop: RealEstateQueryArrayKey;
    }
  >
) => {
  const prev: AppStateSlices = state.slices;
  const next: AppStateSlices = {
    ...prev,
    stagedRealEstateQuery: {
      ...prev.stagedRealEstateQuery,
      [action.payload.prop]: action.payload.data
    }
  };

  const event = $event({
    role: "ASSISTANT",
    prev,
    next,
    patch: {
      type: "ARRAY",
      group: action.payload.group,
      value: action.payload.data,
      prop: action.payload.prop,
      diff: diff.array(
        prev.stagedRealEstateQuery[action.payload.prop],
        action.payload.data
      )
    }
  });

  state.timeline.push(event);
  state.slices = next;
};

const handleEmptySubmission = (state: AppState) => {
  state.slices.assistant.sessions[
    state.slices.assistant.sessions.length - 1
  ].state = "INACTIVE";
};

const handleUserYield = (
  state: AppState,
  action: PayloadAction<InputSession["value"]>
) => {
  state.timeline.push({
    role: "USER",
    id: nanoid(),
    date: Date.now(),
    event: {
      type: "YIELD",
      message: action.payload
    }
  });

  state.slices.keyboard.enterDown = false;
  state.slices.assistant.mode = "THINKING";

  const { sessions } = state.slices.assistant;
  sessions[sessions.length - 1].state = "ANALYZING";
};

const handleAssistantYield = (
  state: AppState,
  action: PayloadAction<InputSession["value"]>
) => {
  state.timeline.push({
    role: "ASSISTANT",
    id: nanoid(),
    date: Date.now(),
    event: {
      type: "YIELD",
      message: action.payload
    }
  });

  const { sessions } = state.slices.assistant;
  sessions[sessions.length - 1].state = "RESOLVED";
};

const handleAssistantPlacementChangeRequest = (
  state: AppState,
  action: PayloadAction<AssistantPlacementAction>
) => {
  state.slices.assistant.placement = placement.resolve(
    action.payload,
    state.slices.assistant.placement
  );
};

const returnControl = (state: AppState) => {
  state.slices.assistant.mode = "SLEEPING";

  const { sessions } = state.slices.assistant;
  sessions[sessions.length - 1].state = "COMMITTED";

  sessions.push({
    id: nanoid(),
    state: "INACTIVE",
    value: ""
  });
};

const handleInputIdle = (state: AppState) => {
  const { sessions } = state.slices.assistant;
  sessions[sessions.length - 1].state = "INACTIVE";
};

const handleEnterKeyDown = (state: AppState) => {
  state.slices.keyboard.enterDown = true;
};

const handleEnterKeyUp = (state: AppState) => {
  state.slices.keyboard.enterDown = false;
};

const handleSpaceKeyDown = (state: AppState) => {
  state.slices.keyboard.spaceDown = true;
};

const handleSpaceKeyUp = (state: AppState) => {
  state.slices.keyboard.spaceDown = false;
};

const handleKeyboardInputReceived = (
  state: AppState,
  action: PayloadAction<InputSession["value"]>
) => {
  const { sessions } = state.slices.assistant;
  sessions[sessions.length - 1].state = "INPUTTING";
  sessions[sessions.length - 1].value = action.payload;
};

const handleListeningStarted = (state: AppState) => {
  const { sessions } = state.slices.assistant;
  sessions[sessions.length - 1].state = "LISTENING";
  state.slices.assistant.mode = "LISTENING";
};

const handleListeningAborted = (state: AppState) => {
  const { sessions } = state.slices.assistant;
  sessions[sessions.length - 1].state = "INACTIVE";
  state.slices.assistant.mode = "SLEEPING";
};

const handleVoiceInputReceived = (
  state: AppState,
  action: PayloadAction<InputSession["value"]>
) => {
  const { sessions } = state.slices.assistant;
  sessions[sessions.length - 1].value = action.payload;
};

const setResolvingIntents = (state: AppState) => {
  state.slices.assistant.mode = "WORKING";
};

const commitRealEstateQuery = (state: AppState) => {
  state.slices.realEstateQuery = clone(state.slices.stagedRealEstateQuery);
};

const replaceRealEstateQuery = (
  state: AppState,
  action: PayloadAction<RealEstateQuery>
) => {
  state.slices.realEstateQuery = clone(action.payload);
  state.slices.stagedRealEstateQuery = clone(action.payload);
};

const resetRealEstateQuery = (state: AppState) => {
  state.slices.realEstateQuery = defaults().slices.realEstateQuery;
  state.slices.stagedRealEstateQuery = defaults().slices.stagedRealEstateQuery;
};

const init = (initial: DeepPartial<AppState> = {}) => {
  const initialState = extend<AppState, DeepPartial<AppState>>(
    defaults(),
    initial
  ) as AppState;

  const { actions, reducer } = createSlice({
    name: "root",
    initialState,
    reducers: {
      commitRealEstateQuery,
      handleAssistantPlacementChangeRequest,
      handleAssistantYield,
      handleEmptySubmission,
      handleEnterKeyDown,
      handleEnterKeyUp,
      handleInputIdle,
      handleKeyboardInputReceived,
      handleListeningAborted,
      handleListeningStarted,
      handleSpaceKeyDown,
      handleSpaceKeyUp,
      handleUserYield,
      handleVoiceInputReceived,
      replaceRealEstateQuery,
      resetRealEstateQuery,
      returnControl,
      setArray,
      setBudgetAndAvailability,
      setLocationSource,
      setPageAndSort,
      setResolvingIntents,
      setSpace
    }
  });

  return {
    store: configureStore({ reducer }),
    actions
  };
};

export default init;
