import { PluginUploadFile } from "./generated/contentTypes";
import { z } from "zod";

type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type ResourceId = string;

export type QueryResponse = {
  ids: ResourceId[];
  pagination?: Pagination;
};

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
  purchasePrice?: number;
  formattedPurchasePrice?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
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

export type Filters = {
  btsStations: BTSStation[];
  indoorFeatures: IndoorFeature[];
  lotFeatures: LotFeature[];
  mrtStations: MRTStation[];
  outdoorFeatures: OutdoorFeature[];
  propertyTypes: PropertyType[];
  viewTypes: ViewType[];
};

export const realEstateQuerySchema = z.object({
  "indoor-features": z.string().array().default([]).catch([]),
  "lot-features": z.string().array().default([]).catch([]),
  "outdoor-features": z.string().array().default([]).catch([]),
  "property-type": z.string().array().default([]).catch([]),
  "view-type": z.string().array().default([]).catch([]),
  page: z.number().default(1).catch(1),
  order: z
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
  "max-price": z.coerce.number().default(100_000_000).catch(100_000_000),
  "min-bedrooms": z.coerce.number().default(0).catch(0),
  "max-bedrooms": z.coerce.number().nullable().default(null).catch(null),
  "min-bathrooms": z.coerce.number().default(0).catch(0)
});

export type RealEstateQuery = z.infer<typeof realEstateQuerySchema>;
