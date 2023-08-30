import { txt } from "../utils";
import { z } from "zod";
import NlInputSchema from "../nl-input";
import { FilterSchema } from "..";

export const ArgsSchema = z.tuple([
  NlInputSchema,
  z.array(z.lazy(() => FilterSchema.shape["slug"]))
]);

export const ContextSchema = z.object({
  input: NlInputSchema,
  filters: z.array(z.lazy(() => FilterSchema.omit({ slug: true }))),
  current: z
    .array(z.lazy(() => FilterSchema.shape["id"]))
    .describe(txt(<>An array of id's of currently active filters.</>))
});

export const ReturnsSchema = z
  .object({
    n: z
      .array(z.lazy(() => FilterSchema.shape["id"]))
      .describe(txt(<>An array of updated filter ids</>))
  })
  .transform(({ n }) => n);
