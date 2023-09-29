import { z } from "zod";
import * as RealEstateQuerySchema from "./real-estate-query";
import { TimelineSchema } from "./timeline";

export const AssistantPayloadSchema = z.object({
  timeline: TimelineSchema,
  query: RealEstateQuerySchema.Server
});
