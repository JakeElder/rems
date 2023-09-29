import { AssistantState, GroupedAssistantState } from "@rems/types";

type State = { label: string };

export const assistantStates: Record<AssistantState, State> = {
  CHATTING: { label: "Chatting" },
  SLEEPING: { label: "Sleeping" },
  THINKING: { label: "Thinking" },
  LISTENING: { label: "Listening" },
  CLEARING_QUERY: { label: "Clearing Query" },
  REFINING_QUERY: { label: "Refining Query" },
  OPENING: { label: "Opening" }
};

export const stateToGroup = (state: AssistantState): GroupedAssistantState => {
  const map: Record<AssistantState, GroupedAssistantState> = {
    OPENING: "INTERACTING",
    CHATTING: "INTERACTING",
    SLEEPING: "IDLE",
    THINKING: "THINKING",
    LISTENING: "LISTENING",
    CLEARING_QUERY: "INTERACTING",
    REFINING_QUERY: "INTERACTING"
  };
  return map[state];
};
