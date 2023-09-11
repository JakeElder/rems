import { z } from "zod";

export const UserVerbalInteractionSchema = z.object({
  type: z.literal("VERBAL"),
  input: z.string()
});

export const UserWrittenInteractionSchema = z.object({
  type: z.literal("WRITTEN"),
  response: z.string()
});

export const UserPatchInteractionSchema = z.object({
  type: z.literal("PATCH"),
  response: z.string()
});

export const UserInteractionSchema = z.discriminatedUnion("type", [
  UserVerbalInteractionSchema,
  UserWrittenInteractionSchema,
  UserPatchInteractionSchema
]);
