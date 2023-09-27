import { z } from "zod";
import { PatchSchema } from "./patch";
import { Group } from "./real-estate-query";

export const PatchReactionSchema = z.object({
  type: z.literal("PATCH"),
  group: Group,
  patch: PatchSchema
});

export const LanguageBasedReactionSchema = z.object({
  type: z.literal("LANGUAGE_BASED"),
  message: z.string()
});

export const OpenCloseAssistantReactionSchema = z.object({
  type: z.literal("OPEN_CLOSE_ASSISTANT"),
  open: z.boolean()
});

export const ReactionSchema = z.discriminatedUnion("type", [
  PatchReactionSchema,
  LanguageBasedReactionSchema,
  OpenCloseAssistantReactionSchema
]);
