import { z } from "zod";
import * as RealEstateQuerySchema from "./real-estate-query";
import { FilterSchema } from ".";
import { RemiStateSchema } from "./remi-state";
import { ArrayDiffSchema, ScalarDiffSchema } from "./diff";

export const PatchScalarReactionSchema = z.object({
  type: z.literal("PATCH_SCALAR"),
  patch: RealEstateQuerySchema.URL.partial(),
  diff: z.array(ScalarDiffSchema)
});

export const PatchArrayReactionSchema = z.object({
  type: z.literal("PATCH_ARRAY"),
  key: RealEstateQuerySchema.Arrays.keyof(),
  value: z.array(z.lazy(() => FilterSchema.shape["slug"])),
  diff: z.array(ArrayDiffSchema)
});

export const UpdateStateReactionSchema = z.object({
  type: z.literal("UPDATE_STATE"),
  value: RemiStateSchema
});

export const ReactionSchema = z.discriminatedUnion("type", [
  PatchScalarReactionSchema,
  PatchArrayReactionSchema,
  UpdateStateReactionSchema
]);
