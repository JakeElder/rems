import qs from "qs";
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
  ViewType,
  QuickFilterQueryKey,
  SearchParams,
  Image,
  RealEstateQuery,
  Filter
} from "@rems/types";
import { flatten } from "remeda";
import { RealEstateQuerySchema } from "@rems/schemas";

let URL: null | string = null;
let TOKEN: null | string = null;
let ASSET_URL: null | string = null;

export const init = (url: string, assetURL: string, token: string) => {
  URL = url;
  TOKEN = token;
  ASSET_URL = assetURL;
};

const fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  if (!TOKEN) {
    throw new Error();
  }
  return global.fetch(input, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${TOKEN}` }
  });
};

const adapters = {
  searchParamsToPartialQuery(params: SearchParams): RealEstateQuery {
    const arrayKeys = [
      "indoor-features",
      "lot-features",
      "outdoor-features",
      "property-type",
      "view-types"
    ];

    const p = Object.keys(params).reduce((acc, key) => {
      const k = key.replace(/\[\]$/, "");
      const val = arrayKeys.includes(k)
        ? flatten([...[params[key]]])
        : params[key];
      return { ...acc, [k]: val };
    }, {});

    return RealEstateQuerySchema.parse(p);
  },

  filterSet(res: any): FilterSet {
    const { name, slug, image } = res.attributes;

    return {
      id: res.id,
      name,
      slug,
      image: adapters.image(image.data)
    };
  },

  image(res: any): Image {
    return {
      id: res.id,
      ...res.attributes,
      url: `${ASSET_URL}${res.attributes.url}`
    };
  },

  filter(res: any): Filter {
    const { name, createdAt, updatedAt, slug } = res.attributes;
    return { id: res.id, name, slug, createdAt, updatedAt };
  }
};

export const get = {
  async featuredProperties(): Promise<Property["id"][]> {
    const q = qs.stringify({ populate: ["properties"] });
    const url = `${URL}/featured-property-list?${q}`;
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
    const url = `${URL}/${resource}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
};

export default { get };
