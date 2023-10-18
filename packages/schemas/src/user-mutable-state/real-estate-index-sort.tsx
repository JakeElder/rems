import { z } from "zod";

const RealEstateIndexPageSortSchema = z
  .enum([
    "NEWEST_FIRST",
    "LOWEST_PRICE_FIRST",
    "HIGHEST_PRICE_FIRST",
    "SMALLEST_LIVING_AREA_FIRST",
    "LARGEST_LIVING_AREA_FIRST"
  ])
  .default("NEWEST_FIRST")
  .catch("NEWEST_FIRST");

export default RealEstateIndexPageSortSchema;
