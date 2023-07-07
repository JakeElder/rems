import qs from "qs";
import { fetch } from "./utils";
import {
  Filter,
  IndoorFeature,
  BTSStation,
  MRTStation,
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
      description,
      createdAt,
      updatedAt,
      indoor_features,
      lot_features,
      outdoor_features,
      view_types,
      address,
      publishedAt
    } = res.data.attributes;

    return {
      id: res.data.id,
      title,
      description,
      purchasePrice,
      location: JSON.parse(location),
      formattedPurchasePrice: `฿${purchasePrice.toLocaleString()}`,
      bedrooms,
      bathrooms,
      indoorFeatures: (indoor_features?.data || []).map(adapters.filter),
      lotFeatures: (lot_features?.data || []).map(adapters.filter),
      outdoorFeatures: (outdoor_features?.data || []).map(adapters.filter),
      viewTypes: (view_types?.data || []).map(adapters.filter),
      address,
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
  async quickFilterList() {
    const q = qs.stringify({
      populate: {
        filters: {
          on: {
            "quick-filters.indoor-feature": { populate: ["filter"] },
            "quick-filters.lot-feature": { populate: ["filter"] },
            "quick-filters.outdoor-feature": { populate: ["filter"] },
            "quick-filters.view-type": { populate: ["filter"] }
          }
        }
      }
    });

    const url = `${process.env.API_URL}/quick-filter-list?${q}`;
    const res = await fetch(url);
    const data = await res.json();

    return data.data;
  },

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
        const q = qs.stringify({
          populate: [
            "images",
            "indoor_features",
            "lot_features",
            "outdoor_features",
            "view_types"
          ]
        });
        const url = `${process.env.API_URL}/properties/${id}?${q}`;
        const res = await fetch(url);
        return adapters.property(await res.json());
      })
    );
    return res;
  },

  async property(id: ResourceId): Promise<Property> {
    const q = qs.stringify({
      populate: [
        "images",
        "indoor_features",
        "lot_features",
        "outdoor_features",
        "view_types"
      ]
    });
    const url = `${process.env.API_URL}/properties/${id}?${q}`;
    const res = await fetch(url);
    return adapters.property(await res.json());
  },

  async btsStations(): Promise<BTSStation[]> {
    const { data } = await this.generic("bts-stations");
    return data.map(adapters.filter);
  },

  async indoorFeatures(): Promise<IndoorFeature[]> {
    const { data } = await this.generic("indoor-features");
    return data.map(adapters.filter);
  },

  async lotFeatures(): Promise<LotFeature[]> {
    const { data } = await this.generic("lot-features");
    return data.map(adapters.filter);
  },

  async mrtStations(): Promise<MRTStation[]> {
    const { data } = await this.generic("mrt-stations");
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
