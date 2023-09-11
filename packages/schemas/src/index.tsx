import { z } from "zod";
import { txt } from "./utils";

export * as RealEstateQuerySchema from "./real-estate-query";

export * from "./contact-form";
export * from "./file";
export * from "./image";
export * from "./property";
export * from "./app-config";
export * from "./filter-set";
export * from "./capability";
export * from "./intent";
export * from "./reaction";
export * from "./intent-resolution";
export * from "./remi-state";
export * from "./diff";
export * from "./interaction";
export * from "./assistant-message";
export * from "./timeline";
export * from "./patch";

export * as AiRefinement from "./ai-refinement";
export * as AiCapability from "./ai-capability";

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
