import { PluginUploadFile } from "./generated/contentTypes";
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

export type Image = Partial<
  Omit<PluginUploadFile["attributes"], "width" | "height">
> & {
  id: ResourceId;
  width: number;
  height: number;
  src: string;
  formats?: any;
};

export type CarouselImage = Image & {
  alt: string;
};

export type Property = {
  id: number;
  title: string;
  description: string;
  url: string;
  purchasePrice?: number;
  formattedPurchasePrice?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  livingArea?: number;
  images: Image[];
  location: null | {
    lng: number;
    lat: number;
  };
  indoorFeatures: IndoorFeature[];
  lotFeatures: LotFeature[];
  outdoorFeatures: OutdoorFeature[];
  viewTypes: ViewType[];
  address: string;
  publishedAt: string;
} & CMSAttributes;

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

export type QuickFilterType =
  | "INDOOR_FEATURE"
  | "LOT_FEATURE"
  | "OUTDOOR_FEATURE"
  | "VIEW_TYPE";

export type QuickFilter = {
  type: QuickFilterType;
  filter: Filter;
};

export type Filters = {
  btsStations: BTSStation[];
  indoorFeatures: IndoorFeature[];
  lotFeatures: LotFeature[];
  mrtStations: MRTStation[];
  outdoorFeatures: OutdoorFeature[];
  propertyTypes: PropertyType[];
  viewTypes: ViewType[];
  livingAreaSizes: {
    min: LivingAreaSize[];
    max: LivingAreaSize[];
  };
  quickFilters: QuickFilter[];
};

export const realEstateQuerySchema = z.object({
  "indoor-features": z.string().array().default([]).catch([]),
  "lot-features": z.string().array().default([]).catch([]),
  "outdoor-features": z.string().array().default([]).catch([]),
  "property-type": z.string().array().default([]).catch([]),
  "view-types": z.string().array().default([]).catch([]),
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
  "min-price": z.coerce.number().default(0).catch(0),
  "max-price": z.coerce.number().nullable().default(null).catch(null),
  "min-bedrooms": z.coerce.number().default(0).catch(0),
  "max-bedrooms": z.coerce.number().nullable().default(null).catch(null),
  "min-bathrooms": z.coerce.number().default(0).catch(0),
  "min-living-area": z.coerce.number().default(0).catch(0),
  "max-living-area": z.coerce.number().nullable().default(null).catch(null),
  "nearest-mrt-station": z.string().nullable().default(null).catch(null),
  "nearest-bts-station": z.string().nullable().default(null).catch(null),
  availability: z.enum(["sale", "rent"]).default("sale").catch("sale")
});

export type RealEstateQuery = z.infer<typeof realEstateQuerySchema>;

const partialRealEstateQuery = realEstateQuerySchema.partial();
export type PartialRealEstateQuery = z.infer<typeof partialRealEstateQuery>;

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

export type SiteConfig = {
  defaultTitle: string;
  defaultDescription: string;
  notificationEmail: string;
  lineURL?: string;
  instagramURL?: string;
  linkedInURL?: string;
  facebookURL?: string;
};
