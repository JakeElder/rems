import qs from "qs";
import { fetch } from "./utils";
import { PluginUploadFile } from "@rems/types/cms";

type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

type ResourceId = string;

type QueryResponse = {
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
} & Omit<PluginUploadFile["attributes"], "formats"> & { formats: any };

type Property = {
  id: number;
  title: string;
  purchasePrice: number;
  images: Image[];
} & CMSAttributes;

const adapters = {
  property(res: any): Property {
    return {
      id: res.data.id,
      title: res.data.attributes.Title,
      purchasePrice: res.data.attributes.PurchasePrice,
      images: res.data.attributes.Images.data.map((d: any) => ({
        id: d.id,
        ...d.attributes
      })),
      createdAt: res.data.attributes.createdAt,
      updatedAt: res.data.attributes.updatedAt,
      publishedAt: res.data.attributes.publishedAt
    };
  }
};

const query = {
  async featuredProperties(): Promise<QueryResponse> {
    const q = qs.stringify({ populate: "properties" });
    const url = `${process.env.API_URL}/featured-property-list?${q}`;
    const res = await fetch(url);
    const data = await res.json();

    return {
      ids: data.data.attributes.properties.data.map((d: any) => d.id),
      pagination: {
        page: 1,
        pageCount: 1,
        pageSize: data.data.length,
        total: data.data.length
      }
    };
  },

  async properties(): Promise<QueryResponse> {
    const url = `${process.env.API_URL}/properties`;
    const res = await fetch(url);
    const data = await res.json();

    return {
      ids: data.data.map((d: any) => d.id),
      pagination: data.meta.pagination
    };
  }
};

const get = {
  async properties(...ids: ResourceId[]): Promise<Property[]> {
    const res = Promise.all(
      ids.map(async (id) => {
        const q = qs.stringify({ populate: "Images" });
        const url = `${process.env.API_URL}/properties/${id}?${q}`;
        const res = await fetch(url);
        return adapters.property(await res.json());
      })
    );
    return res;
  }
};

export default { query, get };
