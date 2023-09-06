import { z } from "zod";
import { IntentCodeSchema } from "./intent";
import {
  PatchArrayReactionSchema,
  PatchScalarReactionSchema
} from "./reaction";

export const NoopIntentResolutionSchema = z.object({
  type: z.literal("NOOP"),
  intent: IntentCodeSchema
});

export const ErrorIntentResolutionSchema = z.object({
  type: z.literal("ERROR"),
  intent: IntentCodeSchema,
  error: z.any()
});

export const PatchReactionIntentResolutionSchema = z.object({
  type: z.literal("PATCH"),
  intent: IntentCodeSchema,
  reaction: z.union([PatchScalarReactionSchema, PatchArrayReactionSchema])
});

export const IntentResolutionSchema = z.discriminatedUnion("type", [
  NoopIntentResolutionSchema,
  ErrorIntentResolutionSchema,
  PatchReactionIntentResolutionSchema
]);
