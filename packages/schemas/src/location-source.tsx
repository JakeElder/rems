import { z } from "zod";
import { LatLngSchema } from "./lat-lng";

export const LatLngLocationSourceSchema = z.object({
  type: z.literal("LL"),
  lat: LatLngSchema.shape["lat"],
  lng: LatLngSchema.shape["lng"],
  radius: z.number().nullable()
});

export const NlLocationSourceSchema = z.object({
  type: z.literal("NL"),
  description: z.string(),
  geospatialOperator: z.string(),
  radius: z.number().nullable()
});

export const LocationSourceSchema = z.discriminatedUnion("type", [
  NlLocationSourceSchema,
  LatLngLocationSourceSchema
]);
