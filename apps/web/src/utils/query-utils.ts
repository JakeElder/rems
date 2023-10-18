import {
  BudgetAndAvailabilityRequirementsSchema,
  LocationSourceSchema,
  RealEstateIndexPageAndSortSchema,
  SpaceRequirementsSchema
} from "@rems/schemas/user-mutable-state";
import {
  Filter,
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

type Schema = ZodType<any, ZodTypeDef, any>;

type ActiveCounts = {
  arrays: Record<keyof RealEstateQuery["arrays"], number>;
  scalars: Record<keyof RealEstateQuery["scalars"], number>;
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

export const fromUrl = (url: UrlRealEstateQuery): RealEstateQuery => {
  return {} as RealEstateQuery;
};

export const toUrl = (source: RealEstateQuery): UrlRealEstateQuery => {
  return {} as UrlRealEstateQuery;
};

export const generateQueryString = (
  query: RealEstateQuery,
  page?: RealEstateQuery["scalars"]["pageAndSort"]["page"],
  sort?: RealEstateQuery["scalars"]["pageAndSort"]["sort"]
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
