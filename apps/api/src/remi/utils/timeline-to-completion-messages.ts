import { Timeline } from "@rems/types";
import OpenAI from "openai";

const timelineToCompletionMessages = (
  timeline: Timeline
): OpenAI.Chat.CreateChatCompletionRequestMessage[] => {
  return timeline
    .map<OpenAI.Chat.CreateChatCompletionRequestMessage | null>((e) => {
      if (e.event.type === "YIELD") {
        return {
          role: "system",
          content: "YIELD (control returned to user)"
        };
      }

      if (e.event.type === "ANALYSIS_PERFORMED") {
        return {
          role: "system",
          content: `Analysis Performed: ${JSON.stringify(e.event.analysis)}`
        };
      }

      if (e.event.type === "LANGUAGE_BASED") {
        return {
          role: e.role === "USER" ? "user" : "assistant",
          content: e.event.message
        };
      }

      if (e.event.type === "UPDATE_LOCATION") {
        return {
          role: "function",
          name: "updateLocation",
          content: JSON.stringify({
            from: e.event.prev,
            to: e.event.next
          })
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
    .filter((i): i is OpenAI.Chat.CreateChatCompletionRequestMessage => !!i);
};

export default timelineToCompletionMessages;
