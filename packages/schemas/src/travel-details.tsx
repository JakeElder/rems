import { z } from "zod";
import { LatLngSchema } from "./lat-lng";

export const TravelPointSchema = z.union([z.string(), LatLngSchema]);

export const TravelDetailsSchema = z.object({
  origin: TravelPointSchema,
  destination: TravelPointSchema,
  details: z.any()
});
