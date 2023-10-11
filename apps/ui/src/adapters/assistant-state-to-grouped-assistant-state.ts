import { AssistantState, GroupedAssistantState } from "@rems/types";

const assistantStateToGroupedAssistantState = (
  state: AssistantState
): GroupedAssistantState => {
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

export default assistantStateToGroupedAssistantState;
