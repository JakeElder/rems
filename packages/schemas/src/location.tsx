import { z } from "zod";
import { txt } from "./utils";

export const Radius = z.coerce
  .number()
  .min(1000)
  .max(50_000)
  .default(5000)
  .catch(5000)
  .describe(txt(<>The property search radius in M².</>));

export const NlLocationSourceSchema = z.object({
  type: z.literal("NL").default("NL"),
  description: z.string(),
  radius: Radius.nullable().default(null)
});

export const LatLngSchema = z.object({
  lat: z.number(),
  lng: z.number()
});

export const LatLngLocationSourceSchema = z.object({
  type: z.literal("LL").default("LL"),
  point: LatLngSchema,
  radius: Radius.nullable().default(null)
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
