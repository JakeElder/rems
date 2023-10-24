import z from "zod";

export const InputSessionSchema = z.object({
  id: z.string(),
  value: z.string(),
  state: z.enum([
    "QUEUED",
    "INACTIVE",
    "INPUTTING",
    "LISTENING",
    "ANALYZING",
    "RESOLVING",
    "RESOLVED",
    "COMMITTED"
  ])
});
