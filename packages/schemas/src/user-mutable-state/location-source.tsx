import { z } from "zod";
import { LatLngSchema } from "../lat-lng";

const LatLngLocationSourceSchema = z.object({
  type: z.literal("LL"),
  point: LatLngSchema,
  radius: z.number().nullable()
});

const NlLocationSourceSchema = z.object({
  type: z.literal("NL"),
  description: z.string(),
  geospatialOperator: z.string(),
  radius: z.number().nullable()
});

const LocationSourceSchema = z
  .discriminatedUnion("type", [
    NlLocationSourceSchema,
    LatLngLocationSourceSchema
  ])
  .default({
    type: "NL",
    description: "Bangkok",
    geospatialOperator: "in",
    radius: null
  });

export default LocationSourceSchema;
