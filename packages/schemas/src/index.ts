import { z } from "zod";

export * as RealEstateQuerySchema from "./real-estate-query";

export { ContactFormSchema } from "./contact-form";
export { FileSchema } from "./file";
export { ImageSchema } from "./image";
export { PropertySchema } from "./property";
export { AppConfigSchema } from "./app-config";
export { FilterSetSchema } from "./filter-set";
export { CapabilitySchema } from "./capability";

const filterSchemaFactory = () =>
  z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
  });

export const FilterSchema = filterSchemaFactory();
export const IndoorFeature = filterSchemaFactory();
export const LotFeature = filterSchemaFactory();
export const OutdoorFeature = filterSchemaFactory();
export const ViewType = filterSchemaFactory();
export const PropertyType = filterSchemaFactory();
