import { z } from "zod";
import { MapState } from "../real-estate-query";
import { TimelineSchema } from "../timeline";

export const ContextSchema = z.object({
  current: MapState
});

export const ArgsSchema = z.object({
  current: MapState,
  timeline: TimelineSchema
});

export const ReturnsSchema = z
  .object({ z: MapState.shape["zoom"] })
  .partial()
  .transform(({ z }) => ({ zoom: z }));
