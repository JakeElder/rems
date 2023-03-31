import { PluginUploadFile } from "./cms";

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
  publishedAt: string;
};

type Image = {
  id: ResourceId;
} & Omit<PluginUploadFile["attributes"], "formats" | "width" | "height"> & {
    formats: any;
    width: number;
    height: number;
    src: string;
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
} & CMSAttributes;
