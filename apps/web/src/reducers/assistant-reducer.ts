import {
  InputSession,
  AssistantState,
  CapabilityCode,
  AssistantUiState,
  UiStateAction
} from "@rems/types";
import uuid from "short-uuid";

type ComponentState = {
  sessions: InputSession[];
  state: AssistantState;
  enterDown: boolean;
  spaceDown: boolean;
  uiState: AssistantUiState;
};

type ComponentAction =
  | { type: "EMPTY_SUBMISSION" }
  | { type: "START_ASSISTANT_REQUEST" }
  | { type: "ANALYSIS_COMPLETE"; capability: CapabilityCode }
  | { type: "SUCCESSFUL_ASSISTANT_REQUEST" }
  | { type: "SESSION_COMPLETE" }
  | { type: "INPUT_IDLE" }
  | { type: "MIC_BUTTON_CLICKED" }
  | { type: "ENTER_KEY_DOWN" }
  | { type: "ENTER_KEY_UP" }
  | { type: "SPACE_KEY_DOWN" }
  | { type: "SPACE_KEY_UP" }
  | { type: "UI_STATE_CHANGE"; value: UiStateAction }
  | { type: "KEYBOARD_INPUT_RECEIVED"; value: string }
  | { type: "LISTENING_STARTED" }
  | { type: "LISTENING_ABORTED" }
  | { type: "LISTENING_COMPLETE" }
  | { type: "VOICE_INPUT_RECEIVED"; value: string }
  | { type: "REFINING_QUERY" }
  | { type: "RESPONDING_GENERAL_QUERY" };

const EXPANSION_STATES: AssistantUiState[] = [
  "MINIMISED",
  "DOCKED",
  "WINDOWED"
];

const ui = {
  expand(current: AssistantUiState): AssistantUiState {
    const idx = EXPANSION_STATES.indexOf(current);
    if (idx === -1) {
      return "WINDOWED";
    }
    return EXPANSION_STATES[Math.min(idx + 1, EXPANSION_STATES.length - 1)];
  },

  contract(current: AssistantUiState): AssistantUiState {
    const idx = EXPANSION_STATES.indexOf(current);
    if (idx === -1) {
      return "DOCKED";
    }
    return EXPANSION_STATES[Math.max(idx - 1, 0)];
  }
};

const assistantReducer = (
  prev: ComponentState,
  action: ComponentAction
): ComponentState => {
  switch (action.type) {
    case "EMPTY_SUBMISSION":
      return {
        ...prev,
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...prev.sessions[prev.sessions.length - 1],
            state: "INACTIVE"
          }
        ]
      };

    case "START_ASSISTANT_REQUEST":
      return {
        ...prev,
        enterDown: false,
        state: "THINKING",
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...prev.sessions[prev.sessions.length - 1],
            state: "ANALYZING"
          }
        ]
      };

    case "SUCCESSFUL_ASSISTANT_REQUEST":
      return {
        ...prev,
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...prev.sessions[prev.sessions.length - 1],
            state: "RESOLVED"
          }
        ]
      };

    case "UI_STATE_CHANGE":
      switch (action.value) {
        case "EXPAND":
          return { ...prev, uiState: ui.expand(prev.uiState) };
        case "CONTRACT":
          return { ...prev, uiState: ui.contract(prev.uiState) };
        case "FRAME_LEFT":
          return { ...prev, uiState: "LEFT" };
        case "FRAME_RIGHT":
          return { ...prev, uiState: "RIGHT" };
        case "MINIMIZE":
          return { ...prev, uiState: "MINIMISED" };
        case "MAXIMIZE":
          return { ...prev, uiState: "WINDOWED" };
        default:
          return { ...prev };
      }

    case "SESSION_COMPLETE":
      return {
        ...prev,
        state: "SLEEPING",
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...prev.sessions[prev.sessions.length - 1],
            state: "COMMITTED"
          },
          {
            id: uuid.generate(),
            state: "INACTIVE",
            value: ""
          }
        ]
      };

    case "INPUT_IDLE":
      return {
        ...prev,
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...prev.sessions[prev.sessions.length - 1],
            state: "INACTIVE"
          }
        ]
      };

    case "MIC_BUTTON_CLICKED":
      const session = prev.sessions[prev.sessions.length - 1];
      return {
        ...prev,
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...session,
            state: session.state === "LISTENING" ? "INACTIVE" : "LISTENING"
          }
        ]
      };

    case "ENTER_KEY_DOWN":
      return { ...prev, enterDown: true };

    case "ENTER_KEY_UP":
      return { ...prev, enterDown: false };

    case "SPACE_KEY_DOWN":
      return { ...prev, spaceDown: true };

    case "SPACE_KEY_UP":
      return { ...prev, spaceDown: false };

    case "KEYBOARD_INPUT_RECEIVED":
      return {
        ...prev,
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...prev.sessions[prev.sessions.length - 1],
            value: action.value,
            state: "INPUTTING"
          }
        ]
      };

    case "LISTENING_STARTED":
      return {
        ...prev,
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...prev.sessions[prev.sessions.length - 1],
            state: "LISTENING"
          }
        ],
        state: "LISTENING"
      };

    case "LISTENING_ABORTED":
      return {
        ...prev,
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...prev.sessions[prev.sessions.length - 1],
            state: "INACTIVE"
          }
        ],
        state: "SLEEPING"
      };

    case "VOICE_INPUT_RECEIVED":
      return {
        ...prev,
        sessions: [
          ...prev.sessions.slice(0, -1),
          {
            ...prev.sessions[prev.sessions.length - 1],
            value: action.value
          }
        ]
      };

    case "LISTENING_COMPLETE":
      return { ...prev }; // noop

    case "ANALYSIS_COMPLETE":
      switch (action.capability) {
        case "NEW_QUERY":
        case "REFINE_QUERY":
          return {
            ...prev,
            state: "REFINING_QUERY",
            sessions: [
              ...prev.sessions.slice(0, -1),
              {
                ...prev.sessions[prev.sessions.length - 1],
                state: "RESOLVING"
              }
            ]
          };
        case "RESPOND_GENERAL_QUERY":
          return {
            ...prev,
            state: "CHATTING",
            sessions: [
              ...prev.sessions.slice(0, -1),
              {
                ...prev.sessions[prev.sessions.length - 1],
                state: "RESOLVING"
              }
            ]
          };
        case "CLEAR_QUERY":
          return {
            ...prev,
            state: "CLEARING_QUERY",
            sessions: [
              ...prev.sessions.slice(0, -1),
              {
                ...prev.sessions[prev.sessions.length - 1],
                state: "RESOLVING"
              }
            ]
          };
        case "OPEN_ASSISTANT":
          return {
            ...prev,
            state: "OPENING",
            sessions: [
              ...prev.sessions.slice(0, -1),
              {
                ...prev.sessions[prev.sessions.length - 1],
                state: "RESOLVING"
              }
            ]
          };
        default:
          return { ...prev };
      }

    default:
      throw new Error("Invalid action type");
  }
};

export default assistantReducer;
