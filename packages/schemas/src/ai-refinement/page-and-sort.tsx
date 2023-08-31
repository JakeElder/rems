import { z } from "zod";
import NlInputSchema from "../nl-input";
import { PageAndSort } from "../real-estate-query";

export const ArgsSchema = z.tuple([NlInputSchema, PageAndSort]);

export const ContextSchema = z.object({
  input: NlInputSchema,
  current: z.lazy(() => PageAndSort)
});

export const ReturnsSchema = z
  .object({
    p: PageAndSort.shape["page"],
    s: PageAndSort.shape["sort"]
  })
  .partial()
  .transform(({ p, s }) => ({ page: p, sort: s }));
