import { z } from "zod";
import { AnalysisSchema } from "./analysis";
import { IntentCodeSchema } from "./intent";
import { LocationSchema } from "./location";
import { StateMutationSchema } from "./state-mutation";

export const LanguageBasedInteractionEventSchema = z.object({
  type: z.literal("LANGUAGE_BASED"),
  message: z.string()
});

export const StateMutationInteractionEventSchema = z.object({
  type: z.literal("STATE_MUTATION"),
  mutation: StateMutationSchema
});

export const AnalysisPerformedEventSchema = z.object({
  type: z.literal("ANALYSIS_PERFORMED"),
  analysis: AnalysisSchema
});

export const YieldEventSchema = z.object({
  type: z.literal("YIELD")
});

export const ErrorEventSchema = z.object({
  type: z.literal("ERROR"),
  error: z.any()
});

export const IntentResolutionErrorEventSchema = z.object({
  type: z.literal("INTENT_RESOLUTION_ERROR"),
  intent: IntentCodeSchema,
  error: z.any()
});

export const UpdateLocationEventSchema = z.object({
  type: z.literal("UPDATE_LOCATION"),
  prev: LocationSchema,
  next: LocationSchema
});

export const SystemEventSchema = z.discriminatedUnion("type", [
  ErrorEventSchema,
  IntentResolutionErrorEventSchema,
  AnalysisPerformedEventSchema,
  YieldEventSchema
]);

export const UserEventSchema = z.discriminatedUnion("type", [
  LanguageBasedInteractionEventSchema,
  StateMutationInteractionEventSchema
]);

export const AssistantEventSchema = z.discriminatedUnion("type", [
  LanguageBasedInteractionEventSchema,
  StateMutationInteractionEventSchema,
  UpdateLocationEventSchema
]);

export const EventSchema = z.discriminatedUnion("type", [
  ErrorEventSchema,
  IntentResolutionErrorEventSchema,
  LanguageBasedInteractionEventSchema,
  StateMutationInteractionEventSchema,
  AnalysisPerformedEventSchema,
  YieldEventSchema,
  UpdateLocationEventSchema
]);
