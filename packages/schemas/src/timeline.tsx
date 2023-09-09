import { z } from "zod";
import { UserMessageSchema } from "./user-message";
import { AssistantMessageSchema } from "./assistant-message";

export const TimelineMessage = z.object({
  timestamp: z.date(),
  message: z.union([UserMessageSchema, AssistantMessageSchema])
});

export const TimelineSchema = z.object({
  messages: z.array(TimelineMessage)
});
