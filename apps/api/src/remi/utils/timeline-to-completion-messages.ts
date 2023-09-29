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
      return null;
    })
    .filter((i): i is ChatCompletionRequestMessage => !!i);
};

export default timelineToCompletionMessages;
