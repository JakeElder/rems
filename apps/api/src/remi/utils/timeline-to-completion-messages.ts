import { Timeline } from "@rems/types";
import { ChatCompletionRequestMessage } from "openai";

const timelineToCompletionMessages = (
  timeline: Timeline
): ChatCompletionRequestMessage[] => {
  return timeline
    .map<ChatCompletionRequestMessage | null>((e) => {
      if (e.event.type === "LANGUAGE_BASED") {
        return {
          role: e.role === "USER" ? "user" : "assistant",
          content: e.event.message
        };
      }

      if (e.event.type === "PATCH") {
        return {
          role: "function",
          name: "patchQuery",
          content: JSON.stringify({
            group: e.event.patch.group,
            diff: e.event.patch.diff
          })
        };
      }

      if (e.event.type === "INTENT_RESOLUTION_ERROR") {
        return {
          role: "function",
          name: "logIntentResolutionError",
          content: JSON.stringify({
            intent: e.event.intent,
            error: e.event.error
          })
        };
      }

      return null;
    })
    .filter((i): i is ChatCompletionRequestMessage => !!i);
};

export default timelineToCompletionMessages;
