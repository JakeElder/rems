import { z } from "zod";
import { BoundsSchema } from "./bounds";

export const LocationResolutionSchema = z
  .object({
    id: z.string(),
    lat: z.number(),
    lng: z.number(),
    bounds: BoundsSchema,
    displayName: z.string(),
    editorialSummary: z.string()
  })
  .partial({
    displayName: true,
    editorialSummary: true
  });
