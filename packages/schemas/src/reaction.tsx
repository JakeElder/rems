import { z } from "zod";
import { PatchSchema } from "./patch";

export const PatchReactionSchema = z.object({
  type: z.literal("PATCH"),
  patch: PatchSchema
});

export const VerbalReactionSchema = z.object({
  type: z.literal("VERBAL"),
  message: z.string()
});

export const ReactionSchema = z.discriminatedUnion("type", [
  PatchReactionSchema,
  VerbalReactionSchema
]);
