import z from "zod";
import { InputSessionSchema } from "./input-session";

export const AssistantModeSchema = z.enum([
  "SLEEPING",
  "LISTENING",
  "THINKING",
  "WORKING",
  "CHATTING"
]);

export const AssistantPlacementSchema = z.enum([
  "MINIMISED",
  "DOCKED",
  "WINDOWED",
  "LEFT",
  "RIGHT"
]);

export const AssistantStateSchema = z.object({
  sessions: z.array(InputSessionSchema),
  mode: AssistantModeSchema,
  placement: AssistantPlacementSchema
});
