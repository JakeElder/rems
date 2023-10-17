import { z } from "zod";
import * as RealEstateQuerySchema from "./real-estate-query";
import { TimelineSchema } from "./timeline";
import { LocationSchema } from "./location";

export const AssistantPayloadSchema = z.object({
  timeline: TimelineSchema,
  query: RealEstateQuerySchema.Server,
  location: LocationSchema
});
