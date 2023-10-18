import { z } from "zod";

export const LatLngSchema = z.object({
  lat: z.number(),
  lng: z.number()
});
