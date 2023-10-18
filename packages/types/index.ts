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
  AddScalarDiffSchema,
  RemoveScalarDiffSchema,
  ChangeScalarDiffSchema,
  AddArrayDiffSchema,
  RemoveArrayDiffSchema,
  ScalarDiffSchema,
  ArrayDiffSchema,
  TimelineSchema,
  AssistantStateSchema,
  AssistantPayloadSchema,
  TimelineEventSchema,
  UserTimelineEventSchema,
  AssistantTimelineEventSchema,
  AssistantEventSchema,
  UserEventSchema,
  EventSchema,
  LanguageBasedInteractionEventSchema,
  PatchInteractionEventSchema,
  AnalysisPerformedEventSchema,
  YieldEventSchema,
  ErrorEventSchema,
  SystemTimelineEventSchema,
  IntentResolutionErrorEventSchema,
  SystemEventSchema,
  LocationSchema,
  AnalysisSchema,
  LocationResolutionSchema,
  BoundsSchema,
  LatLngSchema,
  RealEstateQueryStringObjectSchema,
  PaginationSchema
} from "@rems/schemas";
import { LocationSourceSchema } from "@rems/schemas/user-mutable-state";
import { ZodType, z } from "zod";

export type Z<T extends ZodType<any, any, any>> = z.infer<T>;

export type Pagination = Z<typeof PaginationSchema>;

export type ResourceId = string;

export type File = Z<typeof FileSchema>;
export type Image = Z<typeof ImageSchema>;
export type FilterSet = Z<typeof FilterSetSchema>;
export type Capability = Z<typeof CapabilitySchema>;
export type CapabilityCode = Z<typeof CapabilityCodeSchema>;
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

export type AppConfig = Z<typeof AppConfigSchema>;
export type Property = Z<typeof PropertySchema>;

export type ContactFormData = Z<typeof ContactFormSchema>;

export type RealEstateQuery = Z<typeof RealEstateQuerySchema>;
export type RealEstateQueryStringObject = Z<
  typeof RealEstateQueryStringObjectSchema
>;

export type QuickFilterQueryKey = keyof Pick<
  RealEstateQueryStringObject,
  "indoor-features" | "outdoor-features" | "lot-features" | "view-types"
>;

export type SortType = RealEstateQuery["sort"];

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

type InputSessionState =
  | "QUEUED"
  | "INACTIVE"
  | "INPUTTING"
  | "LISTENING"
  | "ANALYZING"
  | "RESOLVING"
  | "RESOLVED"
  | "COMMITTED";

export type InputSession = {
  id: string;
  value: string;
  state: InputSessionState;
};

export type AssistantState = Z<typeof AssistantStateSchema>;
export type AssistantPayload = Z<typeof AssistantPayloadSchema>;

export type UiStateAction =
  | "MINIMIZE"
  | "MAXIMIZE"
  | "CONTRACT"
  | "EXPAND"
  | "FRAME_LEFT"
  | "FRAME_RIGHT";

export type GroupedAssistantState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "INTERACTING";

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
  | "davinci"
  | "davinci-002"
  | "davinci-instruct-beta"
  | "davinci-search-document"
  | "davinci-search-query"
  | "davinci-similarity"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0301"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-16k"
  | "gpt-3.5-turbo-16k-0613"
  | "gpt-3.5-turbo-instruct"
  | "gpt-3.5-turbo-instruct-0914"
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-0613"
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
  | "whisper-1";

export type AddScalarDiff = Z<typeof AddScalarDiffSchema>;
export type RemoveScalarDiff = Z<typeof RemoveScalarDiffSchema>;
export type ChangeScalarDiff = Z<typeof ChangeScalarDiffSchema>;
export type ScalarDiff = Z<typeof ScalarDiffSchema>;

export type AddArrayDiff = Z<typeof AddArrayDiffSchema>;
export type RemoveArrayDiff = Z<typeof RemoveArrayDiffSchema>;
export type ArrayDiff = Z<typeof ArrayDiffSchema>;

// export type ArrayPatch = Z<typeof ArrayPatchSchema>;
// export type ScalarPatch = Z<typeof ScalarPatchSchema>;
// export type Patch = Z<typeof PatchSchema>;

export type Timeline = Z<typeof TimelineSchema>;
export type UserTimelineEvent = Z<typeof UserTimelineEventSchema>;
export type AssistantTimelineEvent = Z<typeof AssistantTimelineEventSchema>;
export type SystemTimelineEvent = Z<typeof SystemTimelineEventSchema>;

export type AssistantEvent = Z<typeof AssistantEventSchema>;
export type UserEvent = Z<typeof UserEventSchema>;
export type SystemEvent = Z<typeof SystemEventSchema>;
export type Event = Z<typeof EventSchema>;

export type LanguageBasedInteractionEvent = Z<
  typeof LanguageBasedInteractionEventSchema
>;
export type PatchInteractionEvent = Z<typeof PatchInteractionEventSchema>;
export type AnalysisPerformedEvent = Z<typeof AnalysisPerformedEventSchema>;
export type YieldEvent = Z<typeof YieldEventSchema>;
export type ErrorEvent = Z<typeof ErrorEventSchema>;
export type IntentResolutionErrorEvent = Z<
  typeof IntentResolutionErrorEventSchema
>;
export type TimelineEvent = Z<typeof TimelineEventSchema>;

export type Analysis = Z<typeof AnalysisSchema>;

export type Logger = (ms: number, message: AssistantTimelineEvent) => void;

export type AssistantUiState =
  | "MINIMISED"
  | "DOCKED"
  | "WINDOWED"
  | "LEFT"
  | "RIGHT";

export type MakeNonNullable<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: NonNullable<T[P]>;
};

export type LocationSource = Z<typeof LocationSourceSchema>;
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
