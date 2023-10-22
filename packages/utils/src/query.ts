import {
  BudgetAndAvailabilityRequirementsSchema,
  LocationSourceSchema,
  NlLocationSourceSchema,
  RealEstateIndexPageAndSortSchema,
  SpaceRequirementsSchema
} from "@rems/schemas/user-mutable-state";
import {
  Filter,
  HasActiveManifest,
  HasGroup,
  RealEstateQuery,
  RealEstateQueryArrayKey,
  UrlRealEstateQuery,
  Z
} from "@rems/types";
import { ZodType } from "zod";
import { omitBy, equals } from "remeda";
import qs from "qs";
import { RealEstateQuerySchema, UrlRealEstateQuerySchema } from "@rems/schemas";
import { constantCase, paramCase } from "change-case-all";

type Schema = ZodType<any>;

type ActiveCounts = Record<keyof Omit<RealEstateQuery, "limit">, number>;

const removeDefaults = <T extends Schema>(
  schema: T,
  data: Z<T>
): Partial<Z<T>> => {
  const defaults = schema.parse({});
  return omitBy(data, (v, k) => equals(defaults[k], v));
};

const countScalars = <T extends Schema>(data: Z<Schema>, schema: T): number => {
  const withoutDefaults = removeDefaults(data, schema);
  return Object.keys(withoutDefaults).length;
};

const countArray = (arr: Filter[]) => arr.length;

export const countActiveProps = (query: RealEstateQuery): number => {
  const counts: ActiveCounts = {
    indoorFeatures: countArray(query.indoorFeatures),
    lotFeatures: countArray(query.lotFeatures),
    outdoorFeatures: countArray(query.outdoorFeatures),
    propertyTypes: countArray(query.propertyTypes),
    viewTypes: countArray(query.viewTypes),
    budgetAndAvailability: countScalars(
      query.budgetAndAvailability,
      BudgetAndAvailabilityRequirementsSchema
    ),
    locationSource: countScalars(query.locationSource, LocationSourceSchema),
    pageAndSort: countScalars(
      query.pageAndSort,
      RealEstateIndexPageAndSortSchema
    ),
    space: countScalars(query.space, SpaceRequirementsSchema)
  };

  const keys = Object.keys(query) as (keyof ActiveCounts)[];
  return keys.reduce((a, v) => a + counts[v], 0);
};

type Filters = Record<RealEstateQueryArrayKey, Filter[]>;

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
        const defaults = NlLocationSourceSchema.parse({});
        return {
          type: "NL",
          description: query["location-source"],
          geospatialOperator: query["location-geospatial-operator"]
            ? query["location-geospatial-operator"]
            : defaults.geospatialOperator,
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
  filters: Filters
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
    propertyTypes: filter.toSource(
      url["property-types"],
      filters.propertyTypes
    ),
    limit: false
  };
};

export const toUrl = (source: RealEstateQuery): UrlRealEstateQuery => {
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
    "radius-enabled": "true",
    ...adapt.toUrl.locationSource(source),
    limit: source.limit ? "true" : "false"
  };
};

export const generateQueryString = (
  query: RealEstateQuery,
  page?: RealEstateQuery["pageAndSort"]["page"],
  sort?: RealEstateQuery["pageAndSort"]["sort"]
) => {
  const updated: RealEstateQuery = {
    ...query,
    pageAndSort: {
      page: page ? page : query.pageAndSort.page,
      sort: sort ? sort : query.pageAndSort.sort
    }
  };

  const string = qs.stringify(
    removeDefaults(UrlRealEstateQuerySchema, toUrl(updated)),
    { arrayFormat: "brackets" }
  );

  return string ? `?${string}` : "";
};

export const has = (
  query: RealEstateQuery,
  group: HasGroup
): HasActiveManifest[HasGroup] => {
  const defaults = RealEstateQuerySchema.parse({});
  const manifest: HasActiveManifest = {
    PRICE:
      query.budgetAndAvailability.minPrice !==
        defaults.budgetAndAvailability.minPrice ||
      query.budgetAndAvailability.maxPrice !==
        defaults.budgetAndAvailability.maxPrice,
    BEDROOMS:
      query.space.minBedrooms !== defaults.space.minBedrooms ||
      query.space.maxBedrooms !== defaults.space.maxBedrooms,
    PROPERTY_TYPE: query.propertyTypes.length > 0
  };

  return manifest[group];
};
