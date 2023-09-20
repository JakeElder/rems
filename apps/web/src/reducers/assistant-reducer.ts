import { AiSearchInputState, AiSearchSession } from "@rems/types";
import uuid from "short-uuid";

type ComponentState = {
  sessions: AiSearchSession[];
  state: AiSearchInputState;
  enterDown: boolean;
  spaceDown: boolean;
  open: boolean;
};

type ComponentAction =
  | { type: "EMPTY_SUBMISSION" }
  | { type: "START_ASSISTANT_REQUEST" }
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
  | { type: "OPEN_CLOSE"; open: boolean };

const assistantReducer = (
  prev: ComponentState,
  action: ComponentAction
): ComponentState => {
  switch (action.type) {
    case "EMPTY_SUBMISSION":
      return { ...prev, state: "inactive" };

    case "START_ASSISTANT_REQUEST":
      return { ...prev, enterDown: false, state: "resolving" };

    case "SUCCESSFUL_ASSISTANT_REQUEST":
      return { ...prev, state: "resolved" };

    case "SESSION_COMPLETE":
      return {
        ...prev,
        state: "inactive",
        sessions: [...prev.sessions, { id: uuid.generate(), value: "" }]
      };

    case "INPUT_IDLE":
      return { ...prev, state: "inactive" };

    case "MIC_BUTTON_CLICKED":
      return {
        ...prev,
        state: prev.state === "listening" ? "inactive" : "listening"
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
            value: action.value
          }
        ],
        state: "inputting"
      };

    case "LISTENING_STARTED":
      return { ...prev, state: "listening" };

    case "LISTENING_ABORTED":
      return { ...prev, state: "inactive" };

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

    default:
      throw new Error("Invalid action type");
  }
};

export default assistantReducer;
