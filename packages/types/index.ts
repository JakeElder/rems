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
  IntentResolutionSchema,
  NoopIntentResolutionSchema,
  ErrorIntentResolutionSchema,
  PatchReactionIntentResolutionSchema,
  RemiStateSchema,
  SleepingRemiStateSchema,
  ThinkingRemiStateSchema,
  ReactingRemiStateSchema,
  AddScalarDiffSchema,
  RemoveScalarDiffSchema,
  ChangeScalarDiffSchema,
  AddArrayDiffSchema,
  RemoveArrayDiffSchema,
  ScalarDiffSchema,
  ArrayDiffSchema,
  InteractionSchema,
  AnalysisAssistantMessageSchema,
  ReactionAssistantMessageSchema,
  SummaryAssistantMessageSchema,
  AssistantMessageSchema,
  LanguageBasedReactionSchema,
  PatchReactionSchema,
  TimelineSchema,
  TimelineEventSchema,
  ArrayPatchSchema,
  ScalarPatchSchema,
  PatchSchema,
  UserVerbalInteractionSchema,
  UserWrittenInteractionSchema,
  UserInteractionSchema,
  UserPatchInteractionSchema
} from "@rems/schemas";
import { ZodType, z } from "zod";

type Z<T extends ZodType<any, any, any>> = z.infer<T>;

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

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

export type RealEstateQuery = Z<typeof RealEstateQuerySchema.URL>;
export type ServerRealEstateQuery = Z<typeof RealEstateQuerySchema.Server>;
export type RealEstateQueryScalars = Z<typeof RealEstateQuerySchema.Scalars>;
export type RealEstateQueryArrays = Z<typeof RealEstateQuerySchema.Arrays>;

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

export type AssistantInputState =
  | "inactive"
  | "inputting"
  | "listening"
  | "resolving"
  | "resolved"
  | "committed";

export type AssistantState =
  | "SLEEPING"
  | "LISTENING"
  | "THINKING"
  | "REFINING_QUERY"
  | "CLEARING_QUERY"
  | "CHATTING";

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

export type IntentResolution = Z<typeof IntentResolutionSchema>;
export type NoopIntentResolution = Z<typeof NoopIntentResolutionSchema>;
export type ErrorIntentResolution = Z<typeof ErrorIntentResolutionSchema>;
export type PatchReactionIntentResolution = Z<
  typeof PatchReactionIntentResolutionSchema
>;

export type Reaction = Z<typeof ReactionSchema>;
export type PatchReaction = Z<typeof PatchReactionSchema>;
export type LanguageBasedReaction = Z<typeof LanguageBasedReactionSchema>;

export type RemiState = Z<typeof RemiStateSchema>;
export type SleepingRemiState = Z<typeof SleepingRemiStateSchema>;
export type ThinkingRemiState = Z<typeof ThinkingRemiStateSchema>;
export type ReactingRemiState = Z<typeof ReactingRemiStateSchema>;

export type AddScalarDiff = Z<typeof AddScalarDiffSchema>;
export type RemoveScalarDiff = Z<typeof RemoveScalarDiffSchema>;
export type ChangeScalarDiff = Z<typeof ChangeScalarDiffSchema>;
export type ScalarDiff = Z<typeof ScalarDiffSchema>;

export type AddArrayDiff = Z<typeof AddArrayDiffSchema>;
export type RemoveArrayDiff = Z<typeof RemoveArrayDiffSchema>;
export type ArrayDiff = Z<typeof ArrayDiffSchema>;

export type ArrayPatch = Z<typeof ArrayPatchSchema>;
export type ScalarPatch = Z<typeof ScalarPatchSchema>;
export type Patch = Z<typeof PatchSchema>;

export type UserVerbalInteraction = Z<typeof UserVerbalInteractionSchema>;
export type UserWrittenInteraction = Z<typeof UserWrittenInteractionSchema>;
export type UserLanguageBasedInteraction =
  | UserVerbalInteraction
  | UserWrittenInteraction;
export type UserPatchInteraction = Z<typeof UserPatchInteractionSchema>;
export type UserInteraction = Z<typeof UserInteractionSchema>;

export type AnalysisAssistantMessage = Z<typeof AnalysisAssistantMessageSchema>;
export type ReactionAssistantMessage = Z<typeof ReactionAssistantMessageSchema>;
export type SummaryAssistantMessage = Z<typeof SummaryAssistantMessageSchema>;
export type AssistantMessage = Z<typeof AssistantMessageSchema>;

export type TimelineEvent = Z<typeof TimelineEventSchema>;
export type Timeline = Z<typeof TimelineSchema>;

export type Interaction = Z<typeof InteractionSchema>;
export type Logger = (ms: number, message: AssistantMessage) => void;

export type ScalarKey = keyof RealEstateQueryScalars;
export type ArrayKey = keyof RealEstateQueryArrays;
