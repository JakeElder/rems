import { z } from "zod";

export const RealEstateIndexPageAndSortSchema = z.object({
  sort: z.enum([
    "NEWEST_FIRST",
    "LOWEST_PRICE_FIRST",
    "HIGHEST_PRICE_FIRST",
    "SMALLEST_LIVING_AREA_FIRST",
    "LARGEST_LIVING_AREA_FIRST"
  ]),
  page: z.number()
});
