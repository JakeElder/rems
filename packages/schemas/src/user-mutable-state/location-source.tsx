import { z } from "zod";
import { LatLngSchema } from "../lat-lng";
import { RadiusSchema } from "../radius";

const LatLngLocationSourceSchema = z.object({
  type: z.literal("LL"),
  point: LatLngSchema,
  radius: RadiusSchema
});

const NlLocationSourceSchema = z.object({
  type: z.literal("NL"),
  description: z.string(),
  geospatialOperator: z.string(),
  radius: RadiusSchema
});

const LocationSourceSchema = z.discriminatedUnion("type", [
  NlLocationSourceSchema,
  LatLngLocationSourceSchema
]);

export default LocationSourceSchema;
