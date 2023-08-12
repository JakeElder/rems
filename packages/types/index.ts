import {
  PartialRealEstateQuerySchema,
  RealEstateQuerySchema,
  ContactFormSchema,
  AiRealEstateQuerySchema,
  PartialAiRealEstateQuerySchema,
  PropertySchema,
  FileSchema,
  ImageSchema,
  ServerRealEstateQuerySchema,
  AppConfigSchema,
  FilterSetSchema,
  FilterSchema
} from "@rems/schemas";
import { PartialServerRealEstateQuerySchema } from "@rems/schemas/src/real-estate-query";
import { z } from "zod";

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type ResourceId = string;

export type File = z.infer<typeof FileSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type FilterSet = z.infer<typeof FilterSetSchema>;

export type Filter = z.infer<typeof FilterSchema>;

export type EntryCard = {
  id: string;
  title: string;
  caption?: string;
  url: string;
  image: Image;
  loading: boolean;
};

export type Area = Filter;
export type BTSStation = Filter;
export type IndoorFeature = Filter;
export type LotFeature = Filter;
export type MRTStation = Filter;
export type OutdoorFeature = Filter;
export type PropertyType = Filter;
export type ViewType = Filter;

export type LivingAreaSize = {
  value: number;
  label: string;
};

export type LotSize = {
  value: number;
  label: string;
};

export type QuickFilter = {
  key: QuickFilterQueryKey;
  filter: Filter;
};

export type Filters = {
  btsStations: BTSStation[];
  indoorFeatures: IndoorFeature[];
  lotFeatures: LotFeature[];
  mrtStations: MRTStation[];
  areas: Area[];
  outdoorFeatures: OutdoorFeature[];
  propertyTypes: PropertyType[];
  viewTypes: ViewType[];
  livingAreaSizes: {
    min: LivingAreaSize[];
    max: LivingAreaSize[];
  };
  lotSizes: {
    min: LotSize[];
    max: LotSize[];
  };
  priceRange: {
    minRentalPrice: number;
    maxRentalPrice: number;
    minPurchasePrice: number;
    maxPurchasePrice: number;
  };
  quickFilters: QuickFilter[];
};

export type AppConfig = z.infer<typeof AppConfigSchema>;
export type Property = z.infer<typeof PropertySchema>;

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export type RealEstateQuery = z.infer<typeof RealEstateQuerySchema>;
export type PartialRealEstateQuery = z.infer<
  typeof PartialRealEstateQuerySchema
>;

export type LngLat = {
  lng: number;
  lat: number;
};

export type MapBounds = {
  sw: LngLat;
  ne: LngLat;
};

export type ServerRealEstateQuery = z.infer<typeof ServerRealEstateQuerySchema>;
export type PartialServerRealEstateQuery = z.infer<
  typeof PartialServerRealEstateQuerySchema
>;

export type AiRealEstateQuery = z.infer<typeof AiRealEstateQuerySchema>;
export type PartialAiRealEstateQuery = z.infer<
  typeof PartialAiRealEstateQuerySchema
>;

export type QuickFilterQueryKey = keyof Pick<
  RealEstateQuery,
  "indoor-features" | "outdoor-features" | "lot-features" | "view-types"
>;

export type SortType = RealEstateQuery["sort"];

export type GetPropertiesResult = {
  query: ServerRealEstateQuery;
  data: Property[];
  pagination: Pagination;
};

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type AiSearchInputState =
  | "inactive"
  | "inputting"
  | "listening"
  | "resolving"
  | "resolved"
  | "committed";

export type ResolvingFilterSet = {
  set: FilterSet;
  data: GetPropertiesResult | undefined;
  isLoading: boolean;
  query: PartialServerRealEstateQuery;
  url: string;
};

export type AiSearchSession = {
  id: string;
  value: string;
};
