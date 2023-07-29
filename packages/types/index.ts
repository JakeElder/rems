import {
  PartialRealEstateQuerySchema,
  RealEstateQuerySchema,
  ContactFormSchema,
  AiRealEstateQuerySchema,
  PartialAiRealEstateQuerySchema,
  PropertySchema,
  FileSchema,
  ImageSchema
} from "@rems/schemas";
import { z } from "zod";

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type ResourceId = string;

type CMSAttributes = {
  createdAt: string;
  updatedAt: string;
};

export type File = z.infer<typeof FileSchema>;
export type Image = z.infer<typeof ImageSchema>;

export type EntryCard = {
  title: string;
  caption: string;
  url: string;
  image: Image;
};

export type Filter = {
  id: number;
  name: string;
  slug: string;
} & CMSAttributes;

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

export type Property = z.infer<typeof PropertySchema>;

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export type RealEstateQuery = z.infer<typeof RealEstateQuerySchema>;
export type PartialRealEstateQuery = z.infer<
  typeof PartialRealEstateQuerySchema
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
  query: RealEstateQuery;
  data: Property[];
  pagination: Pagination;
};

export type FilterSet = {
  id: number;
  name: string;
  slug: string;
  image: Image;
};

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type AppConfig = {
  defaultTitle: string;
  defaultDescription: string;
  notificationEmail: string;
  lineURL?: string;
  instagramURL?: string;
  linkedInURL?: string;
  facebookURL?: string;
};

type BaseQueryStateEntry = {
  hash: string;
  queryString: string;
  nl: string;
};

export type InteractionQueryState = {
  origin: "interaction";
  loading: boolean;
} & BaseQueryStateEntry;

export type NlQueryState = {
  origin: "nl";
} & BaseQueryStateEntry;

export type QueryStateHistoryEntry = InteractionQueryState | NlQueryState;

export type QueryStateHistory = QueryStateHistoryEntry[];

export type AiSearchInputState =
  | "inactive"
  | "inputting"
  | "listening"
  | "resolving"
  | "resolved"
  | "committed";
