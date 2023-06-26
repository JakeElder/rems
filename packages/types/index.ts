import { PluginUploadFile } from "./generated/contentTypes";

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
  publishedAt: string;
} & CMSAttributes;

export type EntryCard = {
  title: string;
  caption: string;
  url: string;
  image: Image;
};

export type IndoorFeature = {
  id: number;
  name: string;
  slug: string;
} & CMSAttributes;

export type PropertyType = {
  id: number;
  name: string;
  slug: string;
} & CMSAttributes;

export type Filters = {
  propertyTypes: PropertyType[];
};
