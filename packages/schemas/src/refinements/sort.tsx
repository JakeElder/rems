import { z } from "zod";
import { Sort } from "../real-estate-query";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({
  timeline: TimelineSchema,
  current: z.lazy(() => Sort)
});

export const ArgsSchema = ContextSchema;

export const ReturnsSchema = z
  .object({ s: Sort })
  .partial()
  .transform(({ s }) => s);
