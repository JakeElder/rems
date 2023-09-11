import { z } from "zod";
import { UserInteractionSchema } from "./user-interaction";
import { AssistantMessageSchema } from "./assistant-message";

export const TimelineMessage = z.object({
  timestamp: z.date(),
  message: z.union([UserInteractionSchema, AssistantMessageSchema])
});

export const TimelineSchema = z.object({
  messages: z.array(TimelineMessage)
});
