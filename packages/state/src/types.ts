import { ZodRawShape, ZodType, z } from "zod";

export type Z<T extends ZodType<any>> = z.infer<T>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const IdentifiableSchema = z
  .object({
    id: z.union([z.number(), z.string()]),
    name: z.string()
  })
  .passthrough();

export type Identifiable = Z<typeof IdentifiableSchema>;

export const identifiable = <T extends ZodRawShape>(
  ...params: Parameters<typeof IdentifiableSchema.extend<T>>
) => {
  return IdentifiableSchema.extend(...params).strict();
};

export const AddScalarDiffSchema = z.object({
  type: z.literal("ADD_SCALAR"),
  prop: z.string(),
  value: z.any()
});

export const RemoveScalarDiffSchema = z.object({
  type: z.literal("REMOVE_SCALAR"),
  prop: z.string(),
  value: z.any()
});

export const ChangeScalarDiffSchema = z.object({
  type: z.literal("CHANGE_SCALAR"),
  prop: z.string(),
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

export const AddFromArrayDiffSchema = z.object({
  type: z.literal("ADD_TO_ARRAY"),
  value: IdentifiableSchema
});

export const RemoveFromArrayDiffSchema = z.object({
  type: z.literal("REMOVE_FROM_ARRAY"),
  value: IdentifiableSchema
});

export const ArrayDiffSchema = z.discriminatedUnion("type", [
  AddFromArrayDiffSchema,
  RemoveFromArrayDiffSchema
]);

export type AddArrayDiff = Z<typeof AddFromArrayDiffSchema>;
export type RemoveArrayDiff = Z<typeof RemoveFromArrayDiffSchema>;
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
  prop: z.string(),
  value: z.array(IdentifiableSchema),
  diff: z.array(ArrayDiffSchema)
});

export const PatchSchema = z.discriminatedUnion("type", [
  ScalarPatchSchema,
  ArrayPatchSchema
]);

export type Patch = Z<typeof PatchSchema>;
export type ScalarPatch = Z<typeof ScalarPatchSchema>;
export type ArrayPatch = Z<typeof ArrayPatchSchema>;

export type Group<
  Id extends string = string,
  S extends ZodType<any> = ZodType<any>
> = {
  id: Id;
  schema: S;
  type: "ARRAY" | "SCALAR";
};

export type ExtractModuleSchema<M extends Group<any, any>, Id> = Extract<
  M,
  { id: Id }
>["schema"];
