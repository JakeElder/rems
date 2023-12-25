import { Timeline } from "@rems/types";
import OpenAI from "openai";

const timelineToCompletionMessages = (
  timeline: Timeline
): OpenAI.Chat.ChatCompletionMessageParam[] => {
  return timeline
    .map<OpenAI.Chat.ChatCompletionMessageParam[] | null>((e) => {
      if (e.event.type === "YIELD") {
        const { state } = e.event;
        return [
          {
            role: e.role === "USER" ? "user" : "assistant",
            content: `ACTION: ${JSON.stringify({ state })}`
          },
          {
            role: e.role === "USER" ? "user" : "assistant",
            content: e.event.message
          }
        ];
      }

      if (e.event.type === "PROPERTY_SELECTED") {
        return [
          {
            role: e.role === "USER" ? "user" : "assistant",
            content: `ACTION: ${JSON.stringify(e.event)}`
          }
        ];
      }

      if (e.event.type === "TRAVEL_DETAILS_ESTABLISHED") {
        return [
          {
            role: "system",
            content: `ACTION: ${JSON.stringify(e.event)}`
          }
        ];
      }

      if (e.event.type === "ANALYSIS_PERFORMED") {
        return [
          {
            role: "system",
            content: `ACTION: ${JSON.stringify(e.event)}`
          }
        ];
      }

      if (e.event.type === "UPDATE_LOCATION") {
        return [
          {
            role: "system",
            content: `ACTION: ${JSON.stringify(e.event)}`
          }
        ];
      }

      if (e.event.type === "STATE_MUTATION") {
        return [
          {
            role: "function",
            name: "patchQuery",
            content: JSON.stringify({
              group: e.event.mutation.patch.group,
              diff: e.event.mutation.patch.diff
            })
          }
        ];
      }

      if (e.event.type === "INTENT_RESOLUTION_ERROR") {
        return [
          {
            role: "function",
            name: "logIntentResolutionError",
            content: JSON.stringify({
              intent: e.event.error.intent,
              error: e.event.error
            })
          }
        ];
      }

      return null;
    })
    .flat()
    .filter((i): i is OpenAI.Chat.ChatCompletionMessageParam => !!i);
};

export default timelineToCompletionMessages;
