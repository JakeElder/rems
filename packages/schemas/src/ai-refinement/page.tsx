import { z } from "zod";
import NlInputSchema from "../nl-input";
import { Page } from "../real-estate-query";

export const ArgsSchema = z.tuple([NlInputSchema, Page]);

export const ContextSchema = z.object({
  input: NlInputSchema,
  current: z.lazy(() => Page)
});

export const ReturnsSchema = z
  .object({ p: Page })
  .partial()
  .transform(({ p }) => p);
