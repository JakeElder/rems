import { z } from "zod";

const Radius = z.coerce.number().nullable().default(null).catch(null);

export const NlLocationSourceSchema = z.object({
  type: z.literal("NL"),
  description: z.string(),
  geospatialOperator: z.string(),
  radius: Radius
});

export const LatLngSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

export const LatLngLocationSourceSchema = z.object({
  type: z.literal("LL"),
  point: LatLngSchema,
  radius: Radius
});

export const LocationSourceSchema = z.discriminatedUnion("type", [
  NlLocationSourceSchema,
  LatLngLocationSourceSchema
]);

export const BoundsSchema = z.object({
  sw: LatLngSchema,
  ne: LatLngSchema
});

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
