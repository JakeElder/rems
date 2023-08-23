import { txt } from "../utils";
import { z } from "zod";
import NlInputSchema from "../nl-input";
import { FilterSchema, IndoorFeature } from "..";

export const ArgsSchema = z.tuple([
  NlInputSchema,
  z.array(z.lazy(() => IndoorFeature.shape["slug"]))
]);

export const ContextSchema = z.object({
  input: NlInputSchema,
  filters: z.array(z.lazy(() => IndoorFeature)),
  current: z
    .array(z.lazy(() => IndoorFeature.shape["id"]))
    .describe(txt(<>An array of id's of currently active indoor features.</>))
});

export const ReturnsSchema = z
  .object({
    n: z
      .array(z.lazy(() => FilterSchema.shape["id"]))
      .describe(txt(<>An array of updated indoor feature ids</>))
  })
  .transform(({ n }) => n);
