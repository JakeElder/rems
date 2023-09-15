import {
  AiSearchInputState,
  AiSearchSession,
  AssistantMessage,
  Timeline
} from "@rems/types";
import uuid from "short-uuid";

export type AssistantState = {
  sessions: AiSearchSession[];
  state: AiSearchInputState;
  enterDown: boolean;
  spaceDown: boolean;
  timeline: Timeline;
};

export type AssistantAction =
  | { type: "EMPTY_SUBMISSION" }
  | { type: "START_ASSISTANT_REQUEST"; nl: string }
  | { type: "SUCCESSFUL_ASSISTANT_REQUEST" }
  | { type: "SESSION_COMPLETE" }
  | { type: "INPUT_IDLE" }
  | { type: "MIC_BUTTON_CLICKED" }
  | { type: "SPACE_KEY_DOWN" }
  | { type: "SPACE_KEY_UP" }
  | { type: "ENTER_KEY_DOWN" }
  | { type: "ENTER_KEY_UP" }
  | { type: "KEYBOARD_INPUT_RECEIVED"; value: string }
  | { type: "LISTENING_STARTED" }
  | { type: "LISTENING_ABORTED" }
  | { type: "LISTENING_COMPLETE" }
  | { type: "VOICE_INPUT_RECEIVED"; value: string }
  | { type: "ASSISTANT_MESSAGE_RECEIVED"; value: AssistantMessage };

const assistantReducer = (
  prev: AssistantState,
  action: AssistantAction
): AssistantState => {
  switch (action.type) {
    case "EMPTY_SUBMISSION":
      return { ...prev, state: "inactive" };

    case "START_ASSISTANT_REQUEST":
      return {
        ...prev,
        enterDown: false,
        state: "resolving",
        timeline: [
          ...prev.timeline,
          {
            type: "USER",
            id: uuid.generate(),
            date: Date.now(),
            interaction: {
              type: "WRITTEN",
              input: action.nl
            }
          }
        ]
      };

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

    case "ASSISTANT_MESSAGE_RECEIVED":
      return {
        ...prev,
        timeline: [
          ...prev.timeline,
          {
            type: "ASSISTANT",
            message: action.value,
            date: Date.now(),
            id: uuid.generate()
          }
        ]
      };

    default:
      throw new Error("Invalid action type");
  }
};

export default assistantReducer;
