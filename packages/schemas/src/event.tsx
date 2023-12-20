import { z } from "zod";
import { LocationSchema } from "./location";
import { StateMutationSchema } from "./state-mutation";
import { AppStateSlicesSchema } from "./app-state-slices";
import { AnalysisSchema } from ".";
import IntentResolutionErrorSchema from "./intent-resolution-error";

export const StateMutationInteractionEventSchema = z.object({
  type: z.literal("STATE_MUTATION"),
  mutation: StateMutationSchema
});

export const AnalysisPerformedEventSchema = z.object({
  type: z.literal("ANALYSIS_PERFORMED"),
  analysis: AnalysisSchema
});

export const YieldEventSchema = z.object({
  type: z.literal("YIELD"),
  message: z.string(),
  state: AppStateSlicesSchema
});

export const ErrorEventSchema = z.object({
  type: z.literal("ERROR"),
  error: z.any()
});

export const IntentResolutionErrorEventSchema = z.object({
  type: z.literal("INTENT_RESOLUTION_ERROR"),
  error: IntentResolutionErrorSchema
});

export const UpdateLocationEventSchema = z.object({
  type: z.literal("UPDATE_LOCATION"),
  prev: LocationSchema,
  next: LocationSchema
});

export const SystemEventSchema = z.discriminatedUnion("type", [
  ErrorEventSchema,
  IntentResolutionErrorEventSchema,
  AnalysisPerformedEventSchema
]);

export const UserEventSchema = z.discriminatedUnion("type", [
  StateMutationInteractionEventSchema,
  YieldEventSchema
]);

export const AssistantEventSchema = z.discriminatedUnion("type", [
  StateMutationInteractionEventSchema,
  UpdateLocationEventSchema,
  YieldEventSchema
]);

export const EventSchema = z.discriminatedUnion("type", [
  ErrorEventSchema,
  AnalysisPerformedEventSchema,
  StateMutationInteractionEventSchema,
  IntentResolutionErrorEventSchema,
  YieldEventSchema,
  UpdateLocationEventSchema
]);
