import { InputSession, AssistantState, CapabilityCode } from "@rems/types";
import uuid from "short-uuid";

type ComponentState = {
  sessions: InputSession[];
  assistantState: AssistantState;
  enterDown: boolean;
  spaceDown: boolean;
  open: boolean;
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
  | { type: "KEYBOARD_INPUT_RECEIVED"; value: string }
  | { type: "LISTENING_STARTED" }
  | { type: "LISTENING_ABORTED" }
  | { type: "LISTENING_COMPLETE" }
  | { type: "VOICE_INPUT_RECEIVED"; value: string }
  | { type: "OPEN_CLOSE"; open: boolean }
  | { type: "REFINING_QUERY" }
  | { type: "RESPONDING_GENERAL_QUERY" };

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
        assistantState: "THINKING",
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

    case "SESSION_COMPLETE":
      return {
        ...prev,
        assistantState: "SLEEPING",
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
      return { ...prev, spaceDown: true, open: true };

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
        assistantState: "LISTENING"
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
        assistantState: "SLEEPING"
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

    case "OPEN_CLOSE":
      return { ...prev, open: action.open };

    case "ANALYSIS_COMPLETE":
      switch (action.capability) {
        case "NEW_QUERY":
        case "REFINE_QUERY":
          return {
            ...prev,
            assistantState: "REFINING_QUERY",
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
            assistantState: "CHATTING",
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
