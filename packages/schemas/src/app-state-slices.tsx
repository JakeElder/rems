import { z } from "zod";
import { RealEstateQuerySchema } from "./real-estate-query";

export const AppStateSlicesSchema = z.object({
  realEstateQuery: RealEstateQuerySchema
});
