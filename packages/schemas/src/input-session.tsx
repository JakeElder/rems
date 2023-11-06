import z from "zod";

export const InputSessionState = z.enum([
  "QUEUED",
  "INACTIVE",
  "INPUTTING",
  "LISTENING",
  "ANALYZING",
  "RESOLVING",
  "RESOLVED",
  "COMMITTED"
]);

export const InputSessionSchema = z.object({
  id: z.string(),
  value: z.string(),
  state: InputSessionState
});
