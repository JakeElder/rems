import { z } from "zod";
import { IntentCodeSchema } from "./intent";
import { CapabilityCodeSchema } from "./capability";
import { ReactionSchema } from "./reaction";
import { InteractionSchema } from "./interaction";

export const AnalysisAssistantMessageSchema = z.object({
  type: z.literal("ANALYSIS"),
  intents: z.array(IntentCodeSchema),
  capability: CapabilityCodeSchema
});

export const ReactionAssistantMessageSchema = z.object({
  type: z.literal("REACTION"),
  reaction: ReactionSchema
});

export const SummaryAssistantMessageSchema = z.object({
  type: z.literal("SUMMARY"),
  summary: z.lazy(() => InteractionSchema)
});

export const UpdateAssistantMessageSchema = z.object({
  type: z.literal("UPDATE"),
  phase: z.enum(["GENERATING_NL_SUMMARY", "COMPLETE"])
});

export const AssistantMessageSchema = z.discriminatedUnion("type", [
  AnalysisAssistantMessageSchema,
  ReactionAssistantMessageSchema,
  SummaryAssistantMessageSchema,
  UpdateAssistantMessageSchema
]);
