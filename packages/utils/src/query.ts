import {
  ApiRealEstateQuery,
  ApiUrlRealEstateQuery,
  ArrayFilters,
  Filter,
  RealEstateQuery,
  SearchParams,
  UrlRealEstateQuery,
  Z
} from "@rems/types";
import { UrlRealEstateQuerySchema } from "@rems/schemas";
import { ZodType } from "zod";
import { omitBy, equals } from "remeda";
import qs from "qs";
import { constantCase, paramCase } from "change-case-all";

type Schema = ZodType<any>;

const removeDefaults = <T extends Schema>(
  schema: T,
  data: Z<T>
): Partial<Z<T>> => {
  const defaults = schema.parse({});
  return omitBy(data, (v, k) => equals(defaults[k], v));
};

const filter = {
  toSource: (slugs: Filter["slug"][], source: Filter[]): Filter[] => {
    const filters = slugs.map((slug) => source.find((f) => f.slug === slug));
    return filters.filter((f): f is Filter => Boolean(f));
  }
};

const adapt = {
  fromUrl: {
    sort: ({ sort }: UrlRealEstateQuery) => {
      return constantCase(sort) as RealEstateQuery["pageAndSort"]["sort"];
    },

    locationSource: (
      query: UrlRealEstateQuery
    ): RealEstateQuery["locationSource"] => {
      if (query["location-source-type"] === "nl") {
        return {
          type: "NL",
          description: query["location-source"],
          geospatialOperator: query["location-geospatial-operator"]
            ? query["location-geospatial-operator"]
            : "in",
          radius: query["radius"]
        };
      }

      throw new Error("LL not implemented");
    },

    availability: ({ availability }: UrlRealEstateQuery) => {
      return constantCase(
        availability
      ) as RealEstateQuery["budgetAndAvailability"]["type"];
    },

    budgetAndAvailability: (
      query: UrlRealEstateQuery
    ): RealEstateQuery["budgetAndAvailability"] => {
      return {
        type: adapt.fromUrl.availability(query),
        minPrice: query["min-price"],
        maxPrice: query["max-price"]
      };
    },

    space: (query: UrlRealEstateQuery): RealEstateQuery["space"] => {
      return {
        minBathrooms: query["min-bathrooms"],
        maxBedrooms: query["max-bedrooms"],
        minBedrooms: query["min-bedrooms"],
        maxLotSize: query["max-lot-size"],
        minLotSize: query["min-lot-size"],
        maxLivingArea: query["max-living-area"],
        minLivingArea: query["min-living-area"]
      };
    }
  },

  toUrl: {
    availability: (
      source: RealEstateQuery
    ): UrlRealEstateQuery["availability"] => {
      return paramCase(
        source.budgetAndAvailability.type
      ) as UrlRealEstateQuery["availability"];
    },

    sort: (source: RealEstateQuery): UrlRealEstateQuery["sort"] => {
      return paramCase(source.pageAndSort.sort) as UrlRealEstateQuery["sort"];
    },

    locationSource: (
      source: RealEstateQuery
    ): Pick<
      UrlRealEstateQuery,
      | "location-source"
      | "location-source-type"
      | "location-geospatial-operator"
    > => {
      const { locationSource } = source;
      if (locationSource.type === "LL") {
        throw new Error("LL not implemented");
      }

      return {
        "location-source-type": "nl",
        "location-geospatial-operator": locationSource.geospatialOperator,
        "location-source": locationSource.description
      };
    }
  }
};

export const fromUrl = (
  url: UrlRealEstateQuery,
  filters: ArrayFilters
): RealEstateQuery => {
  return {
    // Scalars
    pageAndSort: {
      sort: adapt.fromUrl.sort(url),
      page: url.page
    },
    locationSource: adapt.fromUrl.locationSource(url),
    budgetAndAvailability: adapt.fromUrl.budgetAndAvailability(url),
    space: adapt.fromUrl.space(url),
    indoorFeatures: filter.toSource(
      url["indoor-features"],
      filters.indoorFeatures
    ),

    // Arrays
    lotFeatures: filter.toSource(url["lot-features"], filters.lotFeatures),
    outdoorFeatures: filter.toSource(
      url["outdoor-features"],
      filters.outdoorFeatures
    ),
    viewTypes: filter.toSource(url["view-types"], filters.viewTypes),
    propertyTypes: filter.toSource(url["property-types"], filters.propertyTypes)
  };
};

export const toUrlBase = (source: RealEstateQuery): UrlRealEstateQuery => {
  return {
    "indoor-features": source.indoorFeatures.map((feature) => feature.slug),
    "lot-features": source.lotFeatures.map((feature) => feature.slug),
    "outdoor-features": source.outdoorFeatures.map((feature) => feature.slug),
    "view-types": source.viewTypes.map((feature) => feature.slug),
    "property-types": source.propertyTypes.map((feature) => feature.slug),
    "max-price": source.budgetAndAvailability.maxPrice,
    "min-price": source.budgetAndAvailability.minPrice,
    availability: adapt.toUrl.availability(source),
    page: source.pageAndSort.page,
    sort: adapt.toUrl.sort(source),
    "min-bedrooms": source.space.minBedrooms,
    "max-bedrooms": source.space.maxBedrooms,
    "min-bathrooms": source.space.minBathrooms,
    "min-living-area": source.space.minLivingArea,
    "max-living-area": source.space.maxLivingArea,
    "min-lot-size": source.space.minLotSize,
    "max-lot-size": source.space.maxLotSize,
    radius: source.locationSource.radius || 10000,
    ...adapt.toUrl.locationSource(source)
  };
};

export const toApiUrl = (source: ApiRealEstateQuery): ApiUrlRealEstateQuery => {
  const { target, ...rest } = source;
  return { ...toUrlBase(rest), target };
};

export const toUrl = (source: RealEstateQuery): UrlRealEstateQuery => {
  return toUrlBase(source);
};

export const generateApiQueryString = (query: ApiRealEstateQuery) => {
  const string = qs.stringify(
    removeDefaults(UrlRealEstateQuerySchema, toApiUrl(query)),
    { arrayFormat: "comma", encode: false }
  );

  return string ? `?${string}` : "";
};

type GenerateQueryStringOptions = {
  page?: RealEstateQuery["pageAndSort"]["page"];
  sort?: RealEstateQuery["pageAndSort"]["sort"];
};

export const generateQueryString = (
  query: RealEstateQuery,
  options: GenerateQueryStringOptions = {}
) => {
  const { page, sort } = options;

  const updated: RealEstateQuery = {
    ...query,
    pageAndSort: {
      page: page ? page : query.pageAndSort.page,
      sort: sort ? sort : query.pageAndSort.sort
    }
  };

  const string = qs.stringify(
    removeDefaults(UrlRealEstateQuerySchema, toUrl(updated)),
    { arrayFormat: "comma", encode: false }
  );

  return string ? `?${string}` : "";
};

export const fromSearchParams = (
  params: SearchParams,
  filters: ArrayFilters
) => {
  const split = (str: SearchParams[string]) => {
    if (!str) return [];
    return typeof str === "string" ? str.split(",") : str;
  };

  const obj = {
    ...params,
    "indoor-features": split(params["indoor-features"]),
    "outdoor-features": split(params["outdoor-features"]),
    "lot-features": split(params["lot-features"]),
    "view-types": split(params["view-types"]),
    "property-types": split(params["property-types"])
  };

  const url = UrlRealEstateQuerySchema.parse(obj);
  const full = fromUrl(url, filters);

  return full;
};
