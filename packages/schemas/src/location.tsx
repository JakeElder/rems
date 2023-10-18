import { z } from "zod";
import { BoundsSchema } from "./bounds";
import LocationSourceSchema from "./user-mutable-state/location-source";

export const LocationResolutionSchema = z
  .object({
    id: z.string(),
    lat: z.number(),
    lng: z.number(),
    viewport: BoundsSchema,
    displayName: z.string(),
    editorialSummary: z.string()
  })
  .partial({
    displayName: true,
    editorialSummary: true
  });

export const LocationSchema = z.object({
  source: LocationSourceSchema,
  resolution: LocationResolutionSchema
});
