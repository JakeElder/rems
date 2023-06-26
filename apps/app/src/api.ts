import qs from "qs";
import { fetch } from "./utils";
import {
  Filter,
  IndoorFeature,
  LotFeature,
  OutdoorFeature,
  Property,
  PropertyType,
  QueryResponse,
  ResourceId,
  ViewType
} from "@rems/types";

const adapters = {
  property(res: any): Property {
    const {
      title,
      purchasePrice,
      images,
      location,
      bedrooms,
      bathrooms,
      area,
      createdAt,
      updatedAt,
      publishedAt
    } = res.data.attributes;

    return {
      id: res.data.id,
      title,
      purchasePrice,
      location: JSON.parse(location),
      formattedPurchasePrice: `$${purchasePrice.toLocaleString()}`,
      bedrooms,
      bathrooms,
      area,
      images: (images.data || []).map((d: any) => ({
        id: d.id,
        src: `${process.env.ASSET_URL}${d.attributes.url}`,
        ...d.attributes
      })),
      createdAt,
      updatedAt,
      publishedAt
    };
  },

  filter(res: any): Filter {
    const { name, createdAt, updatedAt, slug } = res.attributes;
    return { id: res.id, name, slug, createdAt, updatedAt };
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
        const q = qs.stringify({ populate: "images" });
        const url = `${process.env.API_URL}/properties/${id}?${q}`;
        const res = await fetch(url);
        return adapters.property(await res.json());
      })
    );
    return res;
  },

  async property(id: ResourceId): Promise<Property> {
    const q = qs.stringify({ populate: "images" });
    const url = `${process.env.API_URL}/properties/${id}?${q}`;
    const res = await fetch(url);
    return adapters.property(await res.json());
  },

  async indoorFeatures(): Promise<IndoorFeature[]> {
    const { data } = await this.generic("indoor-features");
    return data.map(adapters.filter);
  },

  async lotFeatures(): Promise<LotFeature[]> {
    const { data } = await this.generic("lot-features");
    return data.map(adapters.filter);
  },

  async outdoorFeatures(): Promise<OutdoorFeature[]> {
    const { data } = await this.generic("outdoor-features");
    return data.map(adapters.filter);
  },

  async propertyTypes(): Promise<PropertyType[]> {
    const { data } = await this.generic("property-types");
    return data.map(adapters.filter);
  },

  async viewTypes(): Promise<ViewType[]> {
    const { data } = await this.generic("view-types");
    return data.map(adapters.filter);
  },

  async generic(resource: string) {
    const url = `${process.env.API_URL}/${resource}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
};

export default { query, get };
