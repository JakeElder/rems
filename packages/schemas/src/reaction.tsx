import { z } from "zod";
import * as RealEstateQuerySchema from "./real-estate-query";
import { FilterSchema } from ".";

export const PatchScalarReactionSchema = z.object({
  type: z.literal("PATCH_SCALAR"),
  patch: RealEstateQuerySchema.URL.partial()
});

export const PatchArrayReactionSchema = z.object({
  type: z.literal("PATCH_ARRAY"),
  key: RealEstateQuerySchema.Arrays.keyof(),
  value: z.array(z.lazy(() => FilterSchema.shape["slug"]))
});

export const ReactionSchema = z.discriminatedUnion("type", [
  PatchScalarReactionSchema,
  PatchArrayReactionSchema
]);
