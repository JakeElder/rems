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
  ResourceId,
  ViewType,
  RealEstateQuery,
  Pagination,
  QuickFilter,
  QuickFilterType,
  SortType
} from "@rems/types";

export const adapters = {
  property(res: any): Property {
    const {
      title,
      purchasePrice,
      images,
      location,
      bedrooms,
      bathrooms,
      livingArea,
      description,
      createdAt,
      updatedAt,
      indoor_features,
      lot_features,
      outdoor_features,
      view_types,
      address,
      publishedAt
    } = res.attributes;

    return {
      id: res.id,
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
      livingArea,
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

const get = {
  async quickFilters(): Promise<QuickFilter[]> {
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
    const json = await res.json();

    const mapType = (component: string): QuickFilterType => {
      const map: Record<string, QuickFilterType> = {
        "quick-filters.indoor-feature": "INDOOR_FEATURE",
        "quick-filters.lot-feature": "LOT_FEATURE",
        "quick-filters.outdoor-feature": "OUTDOOR_FEATURE",
        "quick-filters.view-type": "VIEW_TYPE"
      };
      return map[component];
    };

    const quickFilters = (
      json.data.attributes.filters as any[]
    ).map<QuickFilter>((d: any) => ({
      type: mapType(d.__component),
      filter: d.filter.data.attributes
    }));

    return quickFilters;
  },

  async featuredProperties(): Promise<Property[]> {
    const q = qs.stringify({
      populate: ["properties", "properties.images"]
    });
    const url = `${process.env.API_URL}/featured-property-list?${q}`;
    const res = await fetch(url);
    const json = await res.json();

    return json.data.attributes.properties.data.map(adapters.property);
  },

  async properties(
    query: RealEstateQuery
  ): Promise<{ data: Property[]; pagination: Pagination }> {
    const property_type = { slug: { $in: query["property-type"] } };

    const purchasePrice = {
      $gte: query["min-price"],
      ...(query["max-price"] ? { $lte: query["max-price"] } : {})
    };

    const bedrooms = {
      $gte: query["min-bedrooms"],
      ...(query["max-bedrooms"] ? { $lte: query["max-bedrooms"] } : {})
    };

    const bathrooms = { $gte: query["min-bathrooms"] };

    const view_types = query["view-types"].map((t) => ({
      view_types: { slug: { $in: t } }
    }));

    const indoor_features = query["indoor-features"].map((t) => ({
      indoor_features: { slug: { $in: t } }
    }));

    const outdoor_features = query["outdoor-features"].map((t) => ({
      outdoor_features: { slug: { $in: t } }
    }));

    const lot_features = query["lot-features"].map((t) => ({
      lot_features: { slug: { $in: t } }
    }));

    const livingArea = {
      $gte: query["min-living-area"],
      ...(query["max-living-area"] ? { $lte: query["max-living-area"] } : {})
    };

    const nearest_mrt_station = query["nearest-mrt-station"]
      ? { slug: { $eq: query["nearest-mrt-station"] } }
      : {};

    const nearest_bts_station = query["nearest-bts-station"]
      ? { slug: { $eq: query["nearest-bts-station"] } }
      : {};

    const sort = (() => {
      const map: Record<SortType, string> = {
        "newest-first": "createdAt:desc",
        "lowest-price-first": "purchasePrice",
        "highest-price-first": "purchasePrice:desc",
        "smallest-living-area-first": "livingArea",
        "largest-living-area-first": "livingArea:desc"
      };
      return map[query["sort"]];
    })();

    const q = qs.stringify({
      populate: [
        "images",
        "property_type",
        "indoor_features",
        "lot_features",
        "outdoor_features",
        "view_types"
      ],
      filters: {
        $and: [
          {
            property_type,
            purchasePrice,
            bedrooms,
            bathrooms,
            livingArea,
            nearest_mrt_station,
            nearest_bts_station
          },
          ...view_types,
          ...indoor_features,
          ...outdoor_features,
          ...lot_features
        ]
      },
      sort
    });

    const res = await fetch(`${process.env.API_URL}/properties?${q}`);
    const json = await res.json();

    return {
      data: json.data.map((p: any) => adapters.property(p)),
      pagination: json.meta
    };
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
    const json = await res.json();
    return adapters.property(json.data);
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

export default { get };
