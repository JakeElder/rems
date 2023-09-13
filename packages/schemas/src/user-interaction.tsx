import { z } from "zod";
import { PatchSchema } from "./patch";
import { Group } from "./real-estate-query";

export const UserVerbalInteractionSchema = z.object({
  type: z.literal("VERBAL"),
  input: z.string()
});

export const UserWrittenInteractionSchema = z.object({
  type: z.literal("WRITTEN"),
  input: z.string()
});

export const UserPatchInteractionSchema = z.object({
  type: z.literal("PATCH"),
  group: Group,
  patch: PatchSchema
});

export const UserInteractionSchema = z.discriminatedUnion("type", [
  UserVerbalInteractionSchema,
  UserWrittenInteractionSchema,
  UserPatchInteractionSchema
]);
