import { z } from "zod";
import { TimelineSchema } from "./timeline";
import { AppStateSlicesSchema } from "./app-state-slices";

export const AppStateSchema = z.object({
  slices: AppStateSlicesSchema,
  timeline: TimelineSchema
});
