import { z } from "zod";
import { LocationSourceSchema } from "./location-source";
import { LocationResolutionSchema } from "./location-resolution";

export const LocationSchema = z.object({
  source: LocationSourceSchema,
  resolution: LocationResolutionSchema
});
