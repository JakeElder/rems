import { z } from "zod";
import { ImageSchema } from "./image";

export const FilterSetSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  image: ImageSchema
});
