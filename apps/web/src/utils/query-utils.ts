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
  RealEstateQueryScalarsKey,
  UrlRealEstateQuery,
  Z
} from "@rems/types";
import { ZodType, ZodTypeDef } from "zod";
import { omitBy, equals } from "remeda";
import qs from "qs";
import { UrlRealEstateQuerySchema } from "@rems/schemas";
import { constantCase, paramCase } from "change-case-all";

type Schema = ZodType<any, ZodTypeDef, any>;

type Scalars = RealEstateQuery["scalars"];

type ActiveCounts = {
  arrays: Record<RealEstateQueryArrayKey, number>;
  scalars: Record<RealEstateQueryScalarsKey, number>;
};

const isDefault = <S extends Schema, K extends keyof Z<S>>(
  Schema: S,
  key: K,
  value: Z<S>[K]
): boolean => {
  const defaults = Schema.parse({});
  return defaults[key] === value;
};

const removeDefaults = <T extends Schema>(
  Schema: T,
  data: Z<T>
): Partial<Z<T>> => {
  const defaults = Schema.parse({});
  return omitBy(data, (v, k) => equals(defaults[k], v));
};

const countScalars = <T extends Schema>(data: Z<Schema>, Schema: T): number => {
  const withoutDefaults = removeDefaults(data, Schema);
  return Object.keys(withoutDefaults).length;
};

const countArray = (arr: Filter[]) => arr.length;

export const countActiveProps = (query: RealEstateQuery): number => {
  const { arrays, scalars } = query;

  const counts: ActiveCounts = {
    arrays: {
      indoorFeatures: countArray(arrays.indoorFeatures),
      lotFeatures: countArray(arrays.lotFeatures),
      outdoorFeatures: countArray(arrays.outdoorFeatures),
      propertyTypes: countArray(arrays.propertyTypes),
      viewTypes: countArray(arrays.viewTypes)
    },
    scalars: {
      budgetAndAvailability: countScalars(
        scalars.budgetAndAvailability,
        BudgetAndAvailabilityRequirementsSchema
      ),
      locationSource: countScalars(
        scalars.locationSource,
        LocationSourceSchema
      ),
      pageAndSort: countScalars(
        scalars.pageAndSort,
        RealEstateIndexPageAndSortSchema
      ),
      space: countScalars(scalars.space, SpaceRequirementsSchema)
    }
  };

  const arrayKeys = Object.keys(arrays) as RealEstateQueryArrayKey[];
  const scalarsKeys = Object.keys(scalars) as RealEstateQueryScalarsKey[];

  return (
    arrayKeys.reduce((a, v) => a + counts.arrays[v], 0) +
    scalarsKeys.reduce((a, v) => a + counts.scalars[v], 0)
  );
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
      return constantCase(sort) as Scalars["pageAndSort"]["sort"];
    },

    locationSource: (query: UrlRealEstateQuery): Scalars["locationSource"] => {
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
      ) as Scalars["budgetAndAvailability"]["type"];
    },

    budgetAndAvailability: (
      query: UrlRealEstateQuery
    ): Scalars["budgetAndAvailability"] => {
      return {
        type: adapt.fromUrl.availability(query),
        minPrice: query["min-price"],
        maxPrice: query["max-price"]
      };
    },

    space: (query: UrlRealEstateQuery): Scalars["space"] => {
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
        source.scalars.budgetAndAvailability.type
      ) as UrlRealEstateQuery["availability"];
    },

    sort: (source: RealEstateQuery): UrlRealEstateQuery["sort"] => {
      return paramCase(
        source.scalars.pageAndSort.sort
      ) as UrlRealEstateQuery["sort"];
    },

    locationSource: (
      source: RealEstateQuery
    ): Pick<
      UrlRealEstateQuery,
      | "location-source"
      | "location-source-type"
      | "location-geospatial-operator"
    > => {
      const { locationSource } = source.scalars;
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
    scalars: {
      pageAndSort: {
        sort: adapt.fromUrl.sort(url),
        page: url.page
      },
      locationSource: adapt.fromUrl.locationSource(url),
      budgetAndAvailability: adapt.fromUrl.budgetAndAvailability(url),
      space: adapt.fromUrl.space(url)
    },
    arrays: {
      indoorFeatures: filter.toSource(
        url["indoor-features"],
        filters.indoorFeatures
      ),
      lotFeatures: filter.toSource(url["lot-features"], filters.lotFeatures),
      outdoorFeatures: filter.toSource(
        url["outdoor-features"],
        filters.outdoorFeatures
      ),
      viewTypes: filter.toSource(url["view-types"], filters.viewTypes),
      propertyTypes: filter.toSource(
        url["property-types"],
        filters.propertyTypes
      )
    }
  };
};

export const toUrl = (source: RealEstateQuery): UrlRealEstateQuery => {
  const { scalars, arrays } = source;

  return {
    "indoor-features": arrays.indoorFeatures.map((feature) => feature.slug),
    "lot-features": arrays.lotFeatures.map((feature) => feature.slug),
    "outdoor-features": arrays.outdoorFeatures.map((feature) => feature.slug),
    "view-types": arrays.viewTypes.map((feature) => feature.slug),
    "property-types": arrays.propertyTypes.map((feature) => feature.slug),
    "max-price": scalars.budgetAndAvailability.maxPrice,
    "min-price": scalars.budgetAndAvailability.minPrice,
    availability: adapt.toUrl.availability(source),
    page: scalars.pageAndSort.page,
    sort: adapt.toUrl.sort(source),
    "min-bedrooms": scalars.space.minBedrooms,
    "max-bedrooms": scalars.space.maxBedrooms,
    "min-bathrooms": scalars.space.minBathrooms,
    "min-living-area": scalars.space.minLivingArea,
    "max-living-area": scalars.space.maxLivingArea,
    "min-lot-size": scalars.space.minLotSize,
    "max-lot-size": scalars.space.maxLotSize,
    radius: scalars.locationSource.radius || 10000,
    "radius-enabled": "true",
    ...adapt.toUrl.locationSource(source)
  };
};

export const generateQueryString = (
  query: RealEstateQuery,
  page?: Scalars["pageAndSort"]["page"],
  sort?: Scalars["pageAndSort"]["sort"]
) => {
  const updated: RealEstateQuery = {
    ...query,
    scalars: {
      ...query.scalars,
      pageAndSort: {
        page: page ? page : query.scalars.pageAndSort.page,
        sort: sort ? sort : query.scalars.pageAndSort.sort
      }
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
  const manifest: HasActiveManifest = {
    PRICE:
      !isDefault(
        BudgetAndAvailabilityRequirementsSchema,
        "minPrice",
        query.scalars.budgetAndAvailability.minPrice
      ) ||
      !isDefault(
        BudgetAndAvailabilityRequirementsSchema,
        "maxPrice",
        query.scalars.budgetAndAvailability.minPrice
      ),
    BEDROOMS:
      !isDefault(
        SpaceRequirementsSchema,
        "minBedrooms",
        query.scalars.space.minBedrooms
      ) ||
      !isDefault(
        SpaceRequirementsSchema,
        "maxBedrooms",
        query.scalars.space.maxBedrooms
      ),
    PROPERTY_TYPE: query.arrays.propertyTypes.length > 0
  };

  return manifest[group];
};
