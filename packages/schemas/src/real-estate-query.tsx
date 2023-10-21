import z from "zod";
import {
  BudgetAndAvailabilityRequirementsSchema,
  IndoorFeatureRequirementsSchema,
  LocationSourceSchema,
  LotFeatureRequirementsSchema,
  OutdoorFeatureRequirementsSchema,
  PropertyTypeRequirementsSchema,
  RealEstateIndexPageAndSortSchema,
  SpaceRequirementsSchema,
  ViewTypeRequirementsSchema
} from "./user-mutable-state";
import { FilterSchema } from "./filter";

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

const Array = z.array(FilterSchema.shape["slug"]).default([]).catch([]);

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
