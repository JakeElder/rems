import { FilterSchema } from ".";
import * as RealEstateQuery from "./real-estate-query";
import { z } from "zod";

export const AddScalarDiffSchema = z.object({
  type: z.literal("ADD_SCALAR"),
  props: RealEstateQuery.Scalars.partial()
});

export const AddArrayDiffSchema = z.object({
  type: z.literal("ADD_ARRAY"),
  key: RealEstateQuery.Arrays.keyof(),
  values: z.lazy(() => z.array(FilterSchema.shape["slug"]))
});

export const RemoveScalarDiffSchema = z.object({
  type: z.literal("REMOVE_SCALAR"),
  props: RealEstateQuery.Scalars.partial()
});

export const RemoveArrayDiffSchema = z.object({
  type: z.literal("REMOVE_ARRAY"),
  key: RealEstateQuery.Arrays.keyof(),
  values: z.lazy(() => z.array(FilterSchema.shape["slug"]))
});

export const ChangeScalarDiffSchema = z.object({
  type: z.literal("CHANGE_SCALAR"),
  props: z.record(z.tuple([z.any(), z.any()]))
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
