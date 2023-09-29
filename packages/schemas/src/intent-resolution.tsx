import { z } from "zod";
import { IntentCodeSchema } from "./intent";
import { PatchSchema } from "./patch";

export const NoopIntentResolutionSchema = z.object({
  type: z.literal("NOOP"),
  intent: IntentCodeSchema
});

export const ErrorIntentResolutionSchema = z.object({
  type: z.literal("ERROR"),
  intent: IntentCodeSchema,
  error: z.any()
});

export const PatchInteractionIntentResolutionSchema = z.object({
  type: z.literal("PATCH"),
  intent: IntentCodeSchema,
  patch: PatchSchema
});

export const IntentResolutionSchema = z.discriminatedUnion("type", [
  NoopIntentResolutionSchema,
  ErrorIntentResolutionSchema,
  PatchInteractionIntentResolutionSchema
]);
