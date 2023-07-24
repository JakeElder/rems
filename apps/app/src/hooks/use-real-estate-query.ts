"use client";

import {
  PartialRealEstateQuery,
  QuickFilterQueryKey,
  RealEstateQuery,
  realEstateQuerySchema
} from "@rems/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import update from "immutability-helper";
import { omitBy, equals } from "remeda";
import { setCookie } from "typescript-cookie";

type UseRealEstateQueryReturn = {
  query: RealEstateQuery;
  queryString: string;
  commit: (query: PartialRealEstateQuery) => void;
  has: (param: keyof RealEstateQuery) => boolean;
  activeFilters: number;
  isQuickFilterOn: (key: QuickFilterQueryKey, value: string) => boolean;
  onQuickFilterChange: (
    key: QuickFilterQueryKey,
    value: string,
    on: boolean
  ) => void;
  onValueChange: (
    param: keyof RealEstateQuery,
    value: string | number | null
  ) => void;
  onCheckedChange: (
    param: keyof RealEstateQuery,
    value: string,
    checked: boolean
  ) => void;
  onPageChange: (page: RealEstateQuery["page"]) => void;
  createLink: (page?: number, sort?: RealEstateQuery["sort"]) => string;
  onMinBedsChange: (min: RealEstateQuery["min-bedrooms"]) => void;
  onMaxBedsChange: (max: RealEstateQuery["max-bedrooms"]) => void;
  onPriceRangeChange: (
    min: RealEstateQuery["min-price"],
    max: RealEstateQuery["max-price"]
  ) => void;
  onAvailabilityChange: (availability: RealEstateQuery["availability"]) => void;
  onMinBathsChange: (min: RealEstateQuery["min-bathrooms"]) => void;
  reset: () => void;
};

export const removeDefaults = (
  query: PartialRealEstateQuery
): PartialRealEstateQuery => {
  const defaults = realEstateQuerySchema.parse({});
  return omitBy(query, (v, k) => equals(defaults[k], v));
};

export const generateQueryString = (
  query: PartialRealEstateQuery,
  page?: number,
  sort?: RealEstateQuery["sort"]
) => {
  const string = qs.stringify(
    removeDefaults({
      ...query,
      ...(page ? { page } : {}),
      ...(sort ? { sort } : {})
    }),
    { arrayFormat: "bracket" }
  );
  return string ? `?${string}` : "";
};

const useRealEstateQuery = (): UseRealEstateQueryReturn => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const commit = (query: PartialRealEstateQuery) => {
    const qs = generateQueryString(query);
    router.push(`${pathname}${qs}`);

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + 60 * 5);
    setCookie("referer", qs ? `/real-estate${qs}` : "", {
      expires,
      path: "/"
    });
  };

  const q = qs.parse(params.toString(), { arrayFormat: "bracket" });
  const query = realEstateQuerySchema.parse(q);
  const queryString = generateQueryString(query);

  const defaults = realEstateQuerySchema.parse({});
  const queryWithoutDefaults = omitBy(query, (v, k) => equals(defaults[k], v));

  const has: UseRealEstateQueryReturn["has"] = (param) => {
    return param in queryWithoutDefaults;
  };

  const activeFilters = [
    ...query["property-type"],
    has("area"),
    has("min-price") || has("max-price"),
    has("min-bedrooms") || has("max-bedrooms"),
    has("min-bathrooms"),
    ...query["view-types"],
    ...query["indoor-features"],
    ...query["outdoor-features"],
    ...query["lot-features"],
    has("min-living-area") || has("max-living-area"),
    has("min-lot-size") || has("max-lot-size"),
    has("nearest-mrt-station"),
    has("nearest-bts-station")
  ].filter((i) => i).length;

  return {
    query,
    queryString,

    has,
    activeFilters,

    isQuickFilterOn(key, value) {
      return query[key].includes(value);
    },

    onQuickFilterChange(key, value, on) {
      const nextQuery = update(query, {
        [key]: on
          ? { $push: [value] }
          : { $apply: (p: any) => p.filter((v: any) => v !== value) },
        page: { $set: 1 }
      });
      commit(nextQuery);
    },

    onValueChange: (param, value) => {
      const nextQuery = update(query, {
        [param]: { $set: value },
        page: { $set: 1 }
      });
      commit(nextQuery);
    },

    onPageChange: (page) => {
      const nextQuery = update(query, { page: { $set: page } });
      commit(nextQuery);
    },

    createLink(page, sort) {
      return `/real-estate${generateQueryString(query, page, sort)}`;
    },

    onMinBedsChange: (min) => {
      const nextQuery = update(query, {
        "min-bedrooms": { $set: min },
        ...(query["max-bedrooms"]
          ? { "max-bedrooms": { $set: min === 0 ? null : min } }
          : {}),
        page: { $set: 1 }
      });
      commit(nextQuery);
    },

    onMaxBedsChange: (max) => {
      const nextQuery = update(query, {
        "max-bedrooms": { $set: max },
        page: { $set: 1 }
      });
      commit(nextQuery);
    },

    onPriceRangeChange: (min, max) => {
      const nextQuery = update(query, {
        "min-price": { $set: min },
        "max-price": { $set: max },
        page: { $set: 1 }
      });
      commit(nextQuery);
    },

    onAvailabilityChange: (value) => {
      const nextQuery = update(query, {
        availability: { $set: value },
        "min-price": { $set: 0 },
        "max-price": { $set: null },
        page: { $set: 1 }
      });
      commit(nextQuery);
    },

    onCheckedChange: (param, value, checked) => {
      const nextQuery = update(query, {
        [param]: checked
          ? { $push: [value] }
          : { $apply: (p: any) => p.filter((v: any) => v !== value) },
        page: { $set: 1 }
      });
      commit(nextQuery);
    },

    reset: () => {
      commit(realEstateQuerySchema.parse({}));
    },

    commit,

    onMinBathsChange: (min) => {
      const nextQuery = update(query, {
        "min-bathrooms": { $set: min },
        page: { $set: 1 }
      });
      commit(nextQuery);
    }
  };
};

export default useRealEstateQuery;
