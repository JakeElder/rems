import { createReducer, nanoid } from "@reduxjs/toolkit";
import defaults from "./defaults";
import {
  AppState,
  AppStateSlices,
  AssistantPlacement,
  AssistantPlacementAction,
  TimelineEvent
} from "@rems/types";
import {
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
  returnControl,
  setArray,
  setBudgetAndAvailability,
  setPageAndSort,
  setResolvingIntents,
  setSpaceRequirements
} from "./actions";
import { clone } from "remeda";
import * as diff from "../../diff";

type AppStateMutationTimelineEvent = Extract<
  TimelineEvent,
  { role: "USER" | "ASSISTANT" }
>;

type AppStateMutation = Extract<
  AppStateMutationTimelineEvent["event"],
  { type: "STATE_MUTATION" }
>;

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

const reducer = createReducer<AppState>(defaults(), (builder) => {
  // COMMIT_REAL_ESTATE_QUERY
  builder.addCase(commitRealEstateQuery, (state) => {
    state.slices.realEstateQuery = clone(state.slices.stagedRealEstateQuery);
  });

  // HANDLE_ASSISTANT_PLACEMENT_CHANGE_REQUEST
  builder.addCase(handleAssistantPlacementChangeRequest, (state, action) => {
    state.slices.assistant.placement = placement.resolve(
      action.payload,
      state.slices.assistant.placement
    );
  });

  // HANDLE_ASSISTANT_YIELD
  builder.addCase(handleAssistantYield, (state, action) => {
    state.timeline.push({
      role: "ASSISTANT",
      id: nanoid(),
      date: Date.now(),
      event: {
        type: "YIELD",
        message: action.payload.message,
        state: action.payload.state
      }
    });

    const { sessions } = state.slices.assistant;
    sessions[sessions.length - 1].state = "RESOLVED";
  });

  // HANDLE_EMPTY_SUBMISSION
  builder.addCase(handleEmptySubmission, (state) => {
    state.slices.assistant.sessions[
      state.slices.assistant.sessions.length - 1
    ].state = "INACTIVE";
  });

  // HANDLE_ENTER_KEY_DOWN
  builder.addCase(handleEnterKeyDown, (state) => {
    state.slices.keyboard.enterDown = true;
  });

  // HANDLE_ENTER_KEY_UP
  builder.addCase(handleEnterKeyUp, (state) => {
    state.slices.keyboard.enterDown = false;
  });

  // HANDLE_INPUT_IDLE
  builder.addCase(handleInputIdle, (state) => {
    const { sessions } = state.slices.assistant;
    sessions[sessions.length - 1].state = "INACTIVE";
  });

  // HANDLE_KEYBOARD_INPUT_RECEIVED
  builder.addCase(handleKeyboardInputReceived, (state, action) => {
    const { sessions } = state.slices.assistant;
    sessions[sessions.length - 1].state = "INPUTTING";
    sessions[sessions.length - 1].value = action.payload;
  });

  // HANDLE_LISTENING_ABORTED
  builder.addCase(handleListeningAborted, (state) => {
    const { sessions } = state.slices.assistant;
    sessions[sessions.length - 1].state = "INACTIVE";
    state.slices.assistant.mode = "SLEEPING";
  });

  // HANDLE_LISTENING_STARTED
  builder.addCase(handleListeningStarted, (state) => {
    const { sessions } = state.slices.assistant;
    sessions[sessions.length - 1].state = "LISTENING";
    state.slices.assistant.mode = "LISTENING";
  });

  // HANDLE_SPACE_KEY_DOWN
  builder.addCase(handleSpaceKeyDown, (state) => {
    state.slices.keyboard.spaceDown = true;
  });

  // HANDLE_SPACE_KEY_UP
  builder.addCase(handleSpaceKeyUp, (state) => {
    state.slices.keyboard.spaceDown = false;
  });

  // HANDLE_USER_YIELD
  builder.addCase(handleUserYield, (state, action) => {
    state.timeline.push({
      role: "USER",
      id: nanoid(),
      date: Date.now(),
      event: {
        type: "YIELD",
        message: action.payload.message,
        state: action.payload.state
      }
    });

    state.slices.keyboard.enterDown = false;
    state.slices.assistant.mode = "THINKING";

    const { sessions } = state.slices.assistant;
    sessions[sessions.length - 1].state = "ANALYZING";
  });

  // HANDLE_VOICE_INPUT_RECEIVED
  builder.addCase(handleVoiceInputReceived, (state, action) => {
    const { sessions } = state.slices.assistant;
    sessions[sessions.length - 1].value = action.payload;
  });

  // REPLACE_REAL_ESTATE_QUERY
  builder.addCase(replaceRealEstateQuery, (state, action) => {
    state.slices.realEstateQuery = clone(action.payload);
    state.slices.stagedRealEstateQuery = clone(action.payload);
  });

  // RETURN_CONTROL
  builder.addCase(returnControl, (state) => {
    state.slices.assistant.mode = "SLEEPING";

    const { sessions } = state.slices.assistant;
    sessions[sessions.length - 1].state = "COMMITTED";

    sessions.push({
      id: nanoid(),
      state: "INACTIVE",
      value: ""
    });
  });

  // SET_ARRAY
  builder.addCase(setArray, (state, action) => {
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
  });

  // SET_BUDGET_AND_AVAILABILITY
  builder.addCase(setBudgetAndAvailability, (state, action) => {
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
  });

  // SET_PAGE_AND_SORT
  builder.addCase(setPageAndSort, (state, action) => {
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
  });

  // SET_RESOLVING_INTENTS
  builder.addCase(setResolvingIntents, (state) => {
    state.slices.assistant.mode = "WORKING";
  });

  // SET_SPACE_REQUIREMENTS
  builder.addCase(setSpaceRequirements, (state, action) => {
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
  });
});

export default reducer;
