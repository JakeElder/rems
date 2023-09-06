import { z } from "zod";
import { CapabilityCodeSchema } from "./capability";

export const SleepingRemiStateSchema = z.object({
  name: z.literal("SLEEPING")
});

export const ThinkingRemiStateSchema = z.object({
  name: z.literal("THINKING")
});

export const ReactingRemiStateSchema = z.object({
  name: z.literal("REACTING"),
  capability: CapabilityCodeSchema
});

export const RemiStateSchema = z.discriminatedUnion("name", [
  SleepingRemiStateSchema,
  ThinkingRemiStateSchema,
  ReactingRemiStateSchema
]);
