import { z } from "zod";
import { txt } from "./utils";

export * as RealEstateQuerySchema from "./real-estate-query";

export { ContactFormSchema } from "./contact-form";
export { FileSchema } from "./file";
export { ImageSchema } from "./image";
export { PropertySchema } from "./property";
export { AppConfigSchema } from "./app-config";
export { FilterSetSchema } from "./filter-set";
export { CapabilitySchema } from "./capability";
export { IntentSchema } from "./intent";
export * as AiRefinement from "./ai-refinement";
export * as AiDiff from "./ai-diff";
export * as NlAnalysis from "./nl-analysis";

export const FilterSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string()
});

export const IndoorFeature = FilterSchema.extend({}).describe(
  txt(<>Indoor Features</>)
);
export const LotFeature = FilterSchema.extend({}).describe(
  txt(<>Lot Features</>)
);
export const OutdoorFeature = FilterSchema.extend({}).describe(
  txt(<>Outdoor Features</>)
);
export const ViewType = FilterSchema.extend({}).describe(txt(<>View Types</>));
export const PropertyType = FilterSchema.extend({}).describe(
  txt(<>Property Types</>)
);
