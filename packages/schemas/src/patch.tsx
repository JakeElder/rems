import { z } from "zod";
import * as RealEstateQuerySchema from "./real-estate-query";
import { Group } from "./real-estate-query";
import { FilterSchema } from ".";
import { ArrayDiffSchema, ScalarDiffSchema } from "./diff";

export const ScalarPatchSchema = z.object({
  type: z.literal("SCALAR"),
  group: Group,
  data: RealEstateQuerySchema.URL.partial(),
  diff: z.array(ScalarDiffSchema)
});

export const ArrayPatchSchema = z.object({
  type: z.literal("ARRAY"),
  group: Group,
  key: RealEstateQuerySchema.Arrays.keyof(),
  value: z.array(z.lazy(() => FilterSchema.shape["slug"])),
  diff: z.array(ArrayDiffSchema)
});

export const PatchSchema = z.discriminatedUnion("type", [
  ScalarPatchSchema,
  ArrayPatchSchema
]);
