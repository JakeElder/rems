import { ZodRawShape, ZodType, z } from "zod";

export type Z<T extends ZodType<any>> = z.infer<T>;

const IdentifiableSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string()
});

export type Identifiable = Z<typeof IdentifiableSchema>;

export const identifiable = <T extends ZodRawShape>(
  ...params: Parameters<typeof IdentifiableSchema.extend<T>>
) => {
  return IdentifiableSchema.extend(...params).strict();
};

export const AddScalarDiffSchema = z.object({
  type: z.literal("ADD_SCALAR"),
  k: z.string(),
  value: z.any()
});

export const RemoveScalarDiffSchema = z.object({
  type: z.literal("REMOVE_SCALAR"),
  k: z.string(),
  value: z.any()
});

export const ChangeScalarDiffSchema = z.object({
  type: z.literal("CHANGE_SCALAR"),
  k: z.string(),
  value: z.tuple([z.any(), z.any()])
});

export const ScalarDiffSchema = z.discriminatedUnion("type", [
  AddScalarDiffSchema,
  RemoveScalarDiffSchema,
  ChangeScalarDiffSchema
]);

export type AddScalarDiff = Z<typeof AddScalarDiffSchema>;
export type RemoveScalarDiff = Z<typeof RemoveScalarDiffSchema>;
export type ChangeScalarDiff = Z<typeof ChangeScalarDiffSchema>;
export type ScalarDiff = Z<typeof ScalarDiffSchema>;

export const AddArrayDiffSchema = z.object({
  type: z.literal("ADD_ARRAY"),
  value: IdentifiableSchema
});

export const RemoveArrayDiffSchema = z.object({
  type: z.literal("REMOVE_ARRAY"),
  value: IdentifiableSchema
});

export const ArrayDiffSchema = z.discriminatedUnion("type", [
  AddArrayDiffSchema,
  RemoveArrayDiffSchema
]);

export type AddArrayDiff = Z<typeof AddArrayDiffSchema>;
export type RemoveArrayDiff = Z<typeof RemoveArrayDiffSchema>;
export type ArrayDiff = Z<typeof ArrayDiffSchema>;

export const ScalarPatchSchema = z.object({
  type: z.literal("SCALAR"),
  group: z.string(),
  data: z.record(
    z.string(),
    z.union([z.null(), z.string(), z.number(), z.boolean()])
  ),
  diff: z.array(ScalarDiffSchema)
});

export const ArrayPatchSchema = z.object({
  type: z.literal("ARRAY"),
  group: z.string(),
  k: z.string(),
  value: z.array(IdentifiableSchema.shape["id"]),
  diff: z.array(ArrayDiffSchema)
});

export const PatchSchema = z.discriminatedUnion("type", [
  ScalarPatchSchema,
  ArrayPatchSchema
]);

export type Patch = Z<typeof PatchSchema>;
