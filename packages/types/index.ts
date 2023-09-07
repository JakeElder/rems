import {
  ContactFormSchema,
  PropertySchema,
  FileSchema,
  ImageSchema,
  AppConfigSchema,
  FilterSetSchema,
  FilterSchema,
  CapabilitySchema,
  RealEstateQuerySchema,
  IntentSchema,
  CapabilityCodeSchema,
  IntentCodeSchema,
  ReactionSchema,
  AiCapability,
  IntentResolutionSchema,
  PatchArrayReactionSchema,
  PatchScalarReactionSchema,
  NoopIntentResolutionSchema,
  ErrorIntentResolutionSchema,
  PatchReactionIntentResolutionSchema,
  RemiStateSchema,
  SleepingRemiStateSchema,
  ThinkingRemiStateSchema,
  ReactingRemiStateSchema
} from "@rems/schemas";
import { UpdateStateReactionSchema } from "@rems/schemas/src/reaction";
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
export type Capability = z.infer<typeof CapabilitySchema>;
export type CapabilityCode = z.infer<typeof CapabilityCodeSchema>;
export type Intent = z.infer<typeof IntentSchema>;
export type IntentCode = z.infer<typeof IntentCodeSchema>;

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

export type RealEstateQuery = z.infer<typeof RealEstateQuerySchema.URL>;
export type ServerRealEstateQuery = z.infer<
  typeof RealEstateQuerySchema.Server
>;
export type RealEstateQueryScalars = z.infer<
  typeof RealEstateQuerySchema.Scalars
>;
export type RealEstateQueryArrays = z.infer<
  typeof RealEstateQuerySchema.Arrays
>;

export type LngLat = {
  lng: number;
  lat: number;
};

export type MapBounds = {
  sw: LngLat;
  ne: LngLat;
};

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
  query: Partial<RealEstateQuery>;
  url: string;
};

export type AiSearchSession = {
  id: string;
  value: string;
};

export type OpenAIModel =
  | "gpt-3.5-turbo-16k-0613"
  | "text-davinci-001"
  | "text-search-curie-query-001"
  | "davinci"
  | "text-babbage-001"
  | "curie-instruct-beta"
  | "text-davinci-003"
  | "davinci-similarity"
  | "code-davinci-edit-001"
  | "text-similarity-curie-001"
  | "text-embedding-ada-002"
  | "ada-code-search-text"
  | "text-search-ada-query-001"
  | "gpt-4-0314"
  | "babbage-search-query"
  | "ada-similarity"
  | "gpt-3.5-turbo"
  | "gpt-4-0613"
  | "text-search-ada-doc-001"
  | "text-search-babbage-query-001"
  | "code-search-ada-code-001"
  | "curie-search-document"
  | "text-search-davinci-query-001"
  | "text-search-curie-doc-001"
  | "babbage-search-document"
  | "babbage-code-search-text"
  | "davinci-instruct-beta"
  | "davinci-search-query"
  | "text-similarity-babbage-001"
  | "text-davinci-002"
  | "code-search-babbage-text-001"
  | "babbage"
  | "text-search-davinci-doc-001"
  | "code-search-ada-text-001"
  | "ada-search-query"
  | "text-similarity-ada-001"
  | "whisper-1"
  | "gpt-4"
  | "ada-code-search-code"
  | "ada"
  | "text-davinci-edit-001"
  | "davinci-search-document"
  | "curie-search-query"
  | "babbage-similarity"
  | "ada-search-document"
  | "text-ada-001"
  | "text-similarity-davinci-001"
  | "gpt-3.5-turbo-16k"
  | "curie"
  | "curie-similarity"
  | "gpt-3.5-turbo-0613"
  | "babbage-code-search-code"
  | "code-search-babbage-code-001"
  | "text-search-babbage-doc-001"
  | "text-curie-001"
  | "gpt-3.5-turbo-0301";

export type IntentResolution = z.infer<typeof IntentResolutionSchema>;
export type NoopIntentResolution = z.infer<typeof NoopIntentResolutionSchema>;
export type ErrorIntentResolution = z.infer<typeof ErrorIntentResolutionSchema>;
export type PatchReactionIntentResolution = z.infer<
  typeof PatchReactionIntentResolutionSchema
>;

export type Reaction = z.infer<typeof ReactionSchema>;
export type PatchArrayReaction = z.infer<typeof PatchArrayReactionSchema>;
export type PatchScalarReaction = z.infer<typeof PatchScalarReactionSchema>;
export type PatchReaction = PatchArrayReaction | PatchScalarReaction;
export type UpdateStateReaction = z.infer<typeof UpdateStateReactionSchema>;

export type RemiState = z.infer<typeof RemiStateSchema>;
export type SleepingRemiState = z.infer<typeof SleepingRemiStateSchema>;
export type ThinkingRemiState = z.infer<typeof ThinkingRemiStateSchema>;
export type ReactingRemiState = z.infer<typeof ReactingRemiStateSchema>;

export type QueryRefinementSummary = z.infer<
  typeof AiCapability.RefineQuery.SummarySchema
>;
