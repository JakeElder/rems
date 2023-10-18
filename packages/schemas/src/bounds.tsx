import { z } from "zod";
import { LatLngSchema } from "./lat-lng";

export const BoundsSchema = z.object({
  sw: LatLngSchema,
  ne: LatLngSchema
});
