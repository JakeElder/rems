import z from "zod";
import { InputSessionSchema } from "./input-session";

export const AssistantStateSchema = z.object({
  sessions: z.array(InputSessionSchema),
  mode: z.enum(["SLEEPING", "LISTENING", "THINKING", "WORKING", "CHATTING"]),
  placement: z.enum(["MINIMISED", "DOCKED", "WINDOWED", "LEFT", "RIGHT"])
});
