import { z } from "zod";
import { IntentCodeSchema } from "./intent";
import { CapabilityCodeSchema } from "./capability";
import { ReactionSchema } from "./reaction";
import { InteractionSchema } from "./interaction";

export const AnalysisAssistantMessageSchema = z.object({
  type: z.literal("ANALYSIS"),
  data: z.object({
    intents: z.array(IntentCodeSchema),
    capability: CapabilityCodeSchema
  })
});

export const ReactionAssistantMessageSchema = z.object({
  type: z.literal("REACTION"),
  intent: IntentCodeSchema,
  reaction: ReactionSchema
});

export const SummaryAssistantMessageSchema = z.object({
  type: z.literal("SUMMARY"),
  summary: z.lazy(() => InteractionSchema)
});

export const GeneralResponseAssistantMessageSchema = z.object({
  type: z.literal("GENERAL_RESPONSE"),
  response: z.string()
});

export const AssistantMessageSchema = z.discriminatedUnion("type", [
  AnalysisAssistantMessageSchema,
  ReactionAssistantMessageSchema,
  SummaryAssistantMessageSchema
]);
