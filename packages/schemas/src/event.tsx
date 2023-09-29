import { z } from "zod";
import { PatchSchema } from "./patch";
import { AnalysisSchema } from "./analysis";

export const LanguageBasedInteractionEventSchema = z.object({
  type: z.literal("LANGUAGE_BASED"),
  message: z.string()
});

export const PatchInteractionEventSchema = z.object({
  type: z.literal("PATCH"),
  patch: PatchSchema
});

export const AnalysisPerformedEventSchema = z.object({
  type: z.literal("ANALYSIS_PERFORMED"),
  analysis: AnalysisSchema
});

export const YieldEventSchema = z.object({
  type: z.literal("YIELD")
});

export const UserEventSchema = z.discriminatedUnion("type", [
  LanguageBasedInteractionEventSchema,
  PatchInteractionEventSchema
]);

export const AssistantEventSchema = z.discriminatedUnion("type", [
  LanguageBasedInteractionEventSchema,
  PatchInteractionEventSchema,
  AnalysisPerformedEventSchema,
  YieldEventSchema
]);
