import { z } from "zod";
import { Page } from "../real-estate-query";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({
  timeline: TimelineSchema,
  current: z.lazy(() => Page)
});
export const ArgsSchema = ContextSchema;

export const ReturnsSchema = z
  .object({ p: Page })
  .partial()
  .transform(({ p }) => p);
