import qs from "qs";
import fetch from "./utils/fetch";
import adapters from "./adapters";
import {
  Area,
  BTSStation,
  FilterSet,
  IndoorFeature,
  LotFeature,
  MRTStation,
  OutdoorFeature,
  Property,
  PropertyType,
  QuickFilter,
  AppConfig,
  ViewType,
  QuickFilterQueryKey
} from "@rems/types";

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

    const url = `${process.env.CMS_API_URL}/quick-filter-list?${q}`;
    const res = await fetch(url);
    const json = await res.json();

    const mapKey = (component: string): QuickFilterQueryKey => {
      const map: Record<string, QuickFilterQueryKey> = {
        "quick-filters.indoor-feature": "indoor-features",
        "quick-filters.lot-feature": "lot-features",
        "quick-filters.outdoor-feature": "outdoor-features",
        "quick-filters.view-type": "view-types"
      };
      return map[component];
    };

    const quickFilters = (
      json.data.attributes.filters as any[]
    ).map<QuickFilter>((d: any) => ({
      key: mapKey(d.__component),
      filter: d.filter.data.attributes
    }));

    return quickFilters;
  },

  async popularSearches(): Promise<FilterSet[]> {
    const q = qs.stringify({
      populate: ["filter_sets", "filter_sets.image"]
    });
    const url = `${process.env.CMS_API_URL}/popular-searches-list?${q}`;
    const res = await fetch(url);
    const json = await res.json();

    return json.data.attributes.filter_sets.data.map(adapters.filterSet);
  },

  async appConfig(): Promise<AppConfig> {
    const url = `${process.env.CMS_API_URL}/app-config`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data.attributes;
  },

  async featuredProperties(): Promise<Property["id"][]> {
    const q = qs.stringify({ populate: ["properties"] });
    const url = `${process.env.CMS_API_URL}/featured-property-list?${q}`;
    const res = await fetch(url);
    const json = await res.json();

    return json.data.attributes.properties.data.map((p: any) => p.id);
  },

  async btsStations(): Promise<BTSStation[]> {
    const { data } = await this.generic("bts-stations");
    return data.map(adapters.filter);
  },

  async areas(): Promise<Area[]> {
    const { data } = await this.generic("areas");
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
    const url = `${process.env.CMS_API_URL}/${resource}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
};

export default { get };
