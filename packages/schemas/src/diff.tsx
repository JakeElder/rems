import { z } from "zod";

export const AddScalarDiffSchema = z.object({
  type: z.literal("ADD_SCALAR"),
  k: z.string(),
  value: z.any()
});

export const AddArrayDiffSchema = z.object({
  type: z.literal("ADD_ARRAY"),
  k: z.string(),
  value: z.string()
});

export const RemoveScalarDiffSchema = z.object({
  type: z.literal("REMOVE_SCALAR"),
  k: z.string(),
  value: z.any()
});

export const RemoveArrayDiffSchema = z.object({
  type: z.literal("REMOVE_ARRAY"),
  k: z.string(),
  value: z.string()
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

export const ArrayDiffSchema = z.discriminatedUnion("type", [
  AddArrayDiffSchema,
  RemoveArrayDiffSchema
]);
