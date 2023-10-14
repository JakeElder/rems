import { txt } from "../utils";
import { z } from "zod";
import { FilterSchema, TimelineSchema } from "..";

export const ContextSchema = z.object({
  filters: z.array(z.lazy(() => FilterSchema.omit({ slug: true }))),
  current: z
    .array(z.lazy(() => FilterSchema.shape["id"]))
    .describe(txt(<>Currently active filter id's</>))
});

export const ArgsSchema = z.object({
  timeline: TimelineSchema,
  current: z.array(z.string())
});

export const ReturnsSchema = z
  .object({
    n: z
      .array(z.lazy(() => FilterSchema.shape["id"]))
      .describe(txt(<>An array of updated filter ids</>))
  })
  .transform(({ n }) => n);
