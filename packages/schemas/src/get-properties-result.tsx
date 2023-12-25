import { z } from "zod";
import { RealEstateQuerySchema } from "./real-estate-query";
import { PropertySchema } from "./property";
import { LocationSchema } from "./location";
import { PaginationSchema } from "./pagination";

export const GetPropertiesResultSchema = z.object({
  query: RealEstateQuerySchema,
  data: z.array(PropertySchema),
  location: LocationSchema,
  pagination: PaginationSchema
});
