import z from "zod";
import { FilterSchema } from "./filter";
import { BudgetAndAvailabilityRequirementsSchema } from "./budget-and-availability-requirements";
import { LocationSourceSchema } from "./location-source";
import { RealEstateIndexPageAndSortSchema } from "./real-estate-index-page-and-sort";
import { SpaceRequirementsSchema } from "./space-requirements";
import { IndoorFeatureRequirementsSchema } from "./indoor-feature-requirements";
import { LotFeatureRequirementsSchema } from "./lot-feature-requirements";
import { OutdoorFeatureRequirementsSchema } from "./outdoor-feature-requirements";
import { PropertyTypeRequirementsSchema } from "./property-type-requirements";
import { ViewTypeRequirementsSchema } from "./view-type-requirements";

export const RealEstateQuerySchema = z.object({
  // Scalars
  budgetAndAvailability: BudgetAndAvailabilityRequirementsSchema,
  locationSource: LocationSourceSchema,
  pageAndSort: RealEstateIndexPageAndSortSchema,
  space: SpaceRequirementsSchema,

  // Arrays
  indoorFeatures: IndoorFeatureRequirementsSchema,
  lotFeatures: LotFeatureRequirementsSchema,
  outdoorFeatures: OutdoorFeatureRequirementsSchema,
  propertyTypes: PropertyTypeRequirementsSchema,
  viewTypes: ViewTypeRequirementsSchema
});

const Array = z.array(FilterSchema.shape["slug"]);

export const UrlRealEstateQuerySchema = z.object({
  // Arrays
  "indoor-features": Array,
  "lot-features": Array,
  "outdoor-features": Array,
  "property-types": Array,
  "view-types": Array,

  // Scalar
  "max-price": z.coerce.number().nullable().default(null).catch(null),
  "min-price": z.coerce.number().default(0).catch(0),
  availability: z.enum(["sale", "rent"]).default("sale").catch("sale"),
  page: z.coerce.number().default(1).catch(1),
  sort: z
    .enum([
      "newest-first",
      "lowest-price-first",
      "highest-price-first",
      "smallest-living-area-first",
      "largest-living-area-first"
    ])
    .default("newest-first")
    .catch("newest-first"),
  "min-bedrooms": z.coerce.number().default(0).catch(0),
  "max-bedrooms": z.coerce.number().nullable().default(null).catch(null),
  "min-bathrooms": z.coerce.number().default(0).catch(0),
  "min-living-area": z.coerce.number().default(0).catch(0),
  "max-living-area": z.coerce.number().nullable().default(null).catch(null),
  "min-lot-size": z.coerce.number().default(0).catch(0),
  "max-lot-size": z.coerce.number().nullable().default(null).catch(null),
  "location-source": z.string().catch("Bangkok").default("Bangkok"),
  "location-source-type": z.enum(["nl", "ll"]).catch("nl").default("nl"),
  "location-geospatial-operator": z
    .string()
    .nullable()
    .catch(null)
    .default(null),
  radius: z.coerce
    .number()
    .min(1000)
    .max(100_000)
    .default(10_000)
    .catch(10_000),
  "radius-enabled": z.enum(["true", "false"]).default("false").catch("false")
});

export const ApiUrlRealEstateQuerySchema = UrlRealEstateQuerySchema.extend({
  target: z.enum(["listings", "map"])
});
