import { z } from "zod";
import { LatLngSchema } from "./lat-lng";

export const NearbyPlacesResultSchema = z.object({
  location: LatLngSchema,
  keyword: z.string(),
  places: z.any()
});
