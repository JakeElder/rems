import {
  ContactFormSchema,
  PropertySchema,
  FileSchema,
  ImageSchema,
  AppConfigSchema,
  FilterSetSchema,
  FilterSchema,
  RealEstateQuerySchema,
  IntentSchema,
  IntentCodeSchema,
  TimelineSchema,
  AssistantStateSchema,
  AssistantPayloadSchema,
  TimelineEventSchema,
  UserTimelineEventSchema,
  AssistantTimelineEventSchema,
  AssistantEventSchema,
  UserEventSchema,
  EventSchema,
  StateMutationInteractionEventSchema,
  YieldEventSchema,
  ErrorEventSchema,
  SystemTimelineEventSchema,
  IntentResolutionErrorEventSchema,
  SystemEventSchema,
  LocationSchema,
  LocationResolutionSchema,
  BoundsSchema,
  LatLngSchema,
  UrlRealEstateQuerySchema,
  PaginationSchema,
  AppStateSchema,
  AppStateSlicesSchema,
  StateMutationSchema,
  BudgetAndAvailabilityRequirementsSchema,
  IndoorFeatureRequirementsSchema,
  LocationSourceSchema,
  LotFeatureRequirementsSchema,
  OutdoorFeatureRequirementsSchema,
  PropertyTypeRequirementsSchema,
  RealEstateIndexPageAndSortSchema,
  SpaceRequirementsSchema,
  ViewTypeRequirementsSchema,
  InputSessionSchema,
  ResolvingIntentsEventSchema,
  ApiRealEstateQuerySchema,
  ApiUrlRealEstateQuerySchema,
  ApiRealEstateQueryTargetSchema,
  AssistantModeSchema,
  AssistantPlacementSchema
} from "@rems/schemas";
import { ZodType, z } from "zod";

export type Z<T extends ZodType<any, any, any>> = z.infer<T>;

export type Pagination = Z<typeof PaginationSchema>;

export type ResourceId = string;

export type File = Z<typeof FileSchema>;
export type Image = Z<typeof ImageSchema>;
export type FilterSet = Z<typeof FilterSetSchema>;
export type Intent = Z<typeof IntentSchema>;
export type IntentCode = Z<typeof IntentCodeSchema>;

export type Filter = Z<typeof FilterSchema>;

export type EntryCard = {
  id: string;
  title: string;
  caption?: string;
  url: string;
  image: Image;
  loading: boolean;
};

export type Area = Filter;
export type IndoorFeature = Filter;
export type LotFeature = Filter;
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
  indoorFeatures: IndoorFeature[];
  lotFeatures: LotFeature[];
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

export type AppConfig = Z<typeof AppConfigSchema>;
export type Property = Z<typeof PropertySchema>;

export type ContactFormData = Z<typeof ContactFormSchema>;

export type RealEstateQuery = Z<typeof RealEstateQuerySchema>;
export type UrlRealEstateQuery = Z<typeof UrlRealEstateQuerySchema>;

export type ApiRealEstateQuery = Z<typeof ApiRealEstateQuerySchema>;
export type ApiUrlRealEstateQuery = Z<typeof ApiUrlRealEstateQuerySchema>;

export type ApiRealEstateQueryTarget = Z<typeof ApiRealEstateQueryTargetSchema>;

export type BudgetAndAvailabilityRequirements = Z<
  typeof BudgetAndAvailabilityRequirementsSchema
>;
export type LocationSource = Z<typeof LocationSourceSchema>;
export type RealEstateIndexPageAndSort = Z<
  typeof RealEstateIndexPageAndSortSchema
>;
export type SpaceRequirements = Z<typeof SpaceRequirementsSchema>;
export type IndoorFeatureRequirements = Z<
  typeof IndoorFeatureRequirementsSchema
>;
export type LotFeatureRequirements = Z<typeof LotFeatureRequirementsSchema>;
export type OutdoorFeatureRequirements = Z<
  typeof OutdoorFeatureRequirementsSchema
>;
export type PropertyTypeRequirements = Z<typeof PropertyTypeRequirementsSchema>;
export type ViewTypeRequirements = Z<typeof ViewTypeRequirementsSchema>;

export type QuickFilterQueryKey = keyof Pick<
  RealEstateQuery,
  "indoorFeatures" | "outdoorFeatures" | "lotFeatures" | "viewTypes"
>;

export type RealEstateQueryArrays = Pick<
  RealEstateQuery,
  | "viewTypes"
  | "lotFeatures"
  | "indoorFeatures"
  | "outdoorFeatures"
  | "propertyTypes"
>;

export type RealEstateQueryArrayKey = keyof RealEstateQueryArrays;

export type RealEstateQueryScalars = Pick<
  RealEstateQuery,
  "space" | "locationSource" | "pageAndSort" | "budgetAndAvailability"
>;

export type RealEstateQueryScalarKey = keyof RealEstateQueryArrayKey;

export type SortType = RealEstateQuery["pageAndSort"]["sort"];

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type InputSession = Z<typeof InputSessionSchema>;

export type AssistantState = Z<typeof AssistantStateSchema>;
export type AssistantPayload = Z<typeof AssistantPayloadSchema>;

export type AssistantPlacement = Z<typeof AssistantPlacementSchema>;
export type AssistantMode = Z<typeof AssistantModeSchema>;

export type AssistantPlacementAction =
  | "MINIMIZE"
  | "MAXIMIZE"
  | "CONTRACT"
  | "EXPAND"
  | "FRAME_LEFT"
  | "FRAME_RIGHT";

export type ResolvingFilterSet = {
  set: FilterSet;
  data: GetPropertiesResult | undefined;
  isLoading: boolean;
  query: Partial<RealEstateQuery>;
  url: string;
};

export type OpenAIModel =
  | "ada"
  | "ada-code-search-code"
  | "ada-code-search-text"
  | "ada-search-document"
  | "ada-search-query"
  | "ada-similarity"
  | "babbage"
  | "babbage-002"
  | "babbage-code-search-code"
  | "babbage-code-search-text"
  | "babbage-search-document"
  | "babbage-search-query"
  | "babbage-similarity"
  | "canary-tts"
  | "canary-whisper"
  | "code-davinci-edit-001"
  | "code-search-ada-code-001"
  | "code-search-ada-text-001"
  | "code-search-babbage-code-001"
  | "code-search-babbage-text-001"
  | "curie"
  | "curie-instruct-beta"
  | "curie-search-document"
  | "curie-search-query"
  | "curie-similarity"
  | "dall-e-2"
  | "davinci"
  | "davinci-002"
  | "davinci-instruct-beta"
  | "davinci-search-document"
  | "davinci-search-query"
  | "davinci-similarity"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0301"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-1106"
  | "gpt-3.5-turbo-16k"
  | "gpt-3.5-turbo-16k-0613"
  | "gpt-3.5-turbo-instruct"
  | "gpt-3.5-turbo-instruct-0914"
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-0613"
  | "gpt-4-1106-preview"
  | "gpt-4-vision-preview"
  | "text-ada-001"
  | "text-babbage-001"
  | "text-curie-001"
  | "text-davinci-001"
  | "text-davinci-002"
  | "text-davinci-003"
  | "text-davinci-edit-001"
  | "text-embedding-ada-002"
  | "text-search-ada-doc-001"
  | "text-search-ada-query-001"
  | "text-search-babbage-doc-001"
  | "text-search-babbage-query-001"
  | "text-search-curie-doc-001"
  | "text-search-curie-query-001"
  | "text-search-davinci-doc-001"
  | "text-search-davinci-query-001"
  | "text-similarity-ada-001"
  | "text-similarity-babbage-001"
  | "text-similarity-curie-001"
  | "text-similarity-davinci-001"
  | "tts-1"
  | "tts-1-1106"
  | "tts-1-hd"
  | "tts-1-hd-1106"
  | "whisper-1";

export type Timeline = Z<typeof TimelineSchema>;
export type UserTimelineEvent = Z<typeof UserTimelineEventSchema>;
export type AssistantTimelineEvent = Z<typeof AssistantTimelineEventSchema>;
export type SystemTimelineEvent = Z<typeof SystemTimelineEventSchema>;

export type AssistantEvent = Z<typeof AssistantEventSchema>;
export type UserEvent = Z<typeof UserEventSchema>;
export type SystemEvent = Z<typeof SystemEventSchema>;
export type Event = Z<typeof EventSchema>;

export type StateMutationInteractionEvent = Z<
  typeof StateMutationInteractionEventSchema
>;
export type ResolvingIntentsEvent = Z<typeof ResolvingIntentsEventSchema>;
export type YieldEvent = Z<typeof YieldEventSchema>;
export type ErrorEvent = Z<typeof ErrorEventSchema>;
export type IntentResolutionErrorEvent = Z<
  typeof IntentResolutionErrorEventSchema
>;
export type TimelineEvent = Z<typeof TimelineEventSchema>;
export type StateMutation = Z<typeof StateMutationSchema>;

export type AppState = Z<typeof AppStateSchema>;
export type AppStateSlices = Z<typeof AppStateSlicesSchema>;

export type Logger = (ms: number, message: AssistantTimelineEvent) => void;

export type MakeNonNullable<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: NonNullable<T[P]>;
};

export type LatLngLocationSource = Extract<LocationSource, { type: "LL" }>;
export type NlLocationSource = Extract<LocationSource, { type: "NL" }>;
export type LocationResolution = Z<typeof LocationResolutionSchema>;
export type Location = Z<typeof LocationSchema>;
export type LatLng = Z<typeof LatLngSchema>;
export type Bounds = Z<typeof BoundsSchema>;

export type GetPropertiesResult = {
  query: RealEstateQuery;
  data: Property[];
  location: Location;
  pagination: Pagination;
};

export type ArrayFilters = Record<RealEstateQueryArrayKey, Filter[]>;
