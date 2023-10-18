import { z } from "zod";
import { RealEstateQuerySchema } from "./real-estate-query";
import { TimelineSchema } from "./timeline";
import { LocationResolutionSchema } from "./location";

export const AssistantPayloadSchema = z.object({
  timeline: TimelineSchema,
  query: RealEstateQuerySchema,
  locationResolution: LocationResolutionSchema
});
