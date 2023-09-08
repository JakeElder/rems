import { z } from "zod";

export const FilterSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string()
});
