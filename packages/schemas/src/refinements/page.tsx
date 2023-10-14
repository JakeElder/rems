import { z } from "zod";
import { Page } from "../real-estate-query";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({
  current: z.lazy(() => Page)
});

export const ArgsSchema = z.object({
  current: z.lazy(() => Page),
  timeline: TimelineSchema
});

export const ReturnsSchema = z
  .object({ p: Page })
  .partial()
  .transform(({ p }) => p);
