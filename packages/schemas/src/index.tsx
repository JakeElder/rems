import { z } from "zod";
import { txt } from "./utils";

export * as RealEstateQuerySchema from "./real-estate-query";

export * from "./app-config";
export * from "./assistant-message";
export * from "./capability";
export * from "./chat-context";
export * from "./contact-form";
export * from "./diff";
export * from "./file";
export * from "./filter-set";
export * from "./image";
export * from "./intent";
export * from "./intent-resolution";
export * from "./interaction";
export * from "./patch";
export * from "./property";
export * from "./reaction";
export * from "./remi-state";
export * from "./timeline";
export * from "./user-interaction";

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
