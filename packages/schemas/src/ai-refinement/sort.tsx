import { z } from "zod";
import NlInputSchema from "../nl-input";
import { Sort } from "../real-estate-query";

export const ArgsSchema = z.tuple([NlInputSchema, Sort]);

export const ContextSchema = z.object({
  input: NlInputSchema,
  current: z.lazy(() => Sort)
});

export const ReturnsSchema = z
  .object({ s: Sort })
  .partial()
  .transform(({ s }) => s);
