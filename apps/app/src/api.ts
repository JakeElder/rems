import qs from "qs";
import { fetch } from "./utils";
import slugify from "@sindresorhus/slugify";
import { Property, QueryResponse, ResourceId } from "@rems/types";

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

  async indoorFeatures() {
    return this.generic("indoor-features");
  },

  async lotFeatures() {
    return this.generic("lot-features");
  },

  async outdoorFeatures() {
    return this.generic("outdoor-features");
  },

  async propertyTypes() {
    return this.generic("property-types");
  },

  async viewTypes() {
    return this.generic("view-types");
  },

  async generic(resource: string) {
    const url = `${process.env.API_URL}/${resource}`;
    const res = await fetch(url);
    const data = await res.json();

    console.log(
      data.data.map((a: any) => {
        return { ...a.attributes };
      })
    );
  }
};

export default { query, get };
