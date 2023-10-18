"use client";

import { useCallback } from "react";
import {
  QuickFilterQueryKey,
  RealEstateQuery,
  UrlRealEstateQuery
} from "@rems/types";
import { QueryUtils } from "@/utils";
import { useRouter } from "next/router";
import update from "immutability-helper";
import { omitBy, equals } from "remeda";
import { RealEstateQuerySchema, UrlRealEstateQuerySchema } from "@rems/schemas";
import { useDebouncedCallback } from "use-debounce";
import useRealEstateIndexPageState from "./use-real-estate-index-page-state";
import { countActiveProps } from "utils/query-utils";

const { generateQueryString } = QueryUtils;

type Scalars = RealEstateQuery["scalars"];

type UseRealEstateQueryReturn = {
  query: RealEstateQuery;
  stagedQuery: RealEstateQuery;
  queryString: string;
  patch: (query: Partial<RealEstateQuery>) => void;
  commit: () => void;
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
  onPageChange: (page: Scalars["pageAndSort"]["page"]) => void;
  createLink: (
    page?: Scalars["pageAndSort"]["page"],
    sort?: Scalars["pageAndSort"]["sort"]
  ) => string;
  onMinBedsChange: (min: Scalars["space"]["minBedrooms"]) => void;
  onMaxBedsChange: (max: Scalars["space"]["maxBedrooms"]) => void;
  onPriceRangeChange: (
    min: Scalars["budgetAndAvailability"]["minPrice"],
    max: Scalars["budgetAndAvailability"]["maxPrice"]
  ) => void;
  onAvailabilityChange: (
    availability: Scalars["budgetAndAvailability"]["type"]
  ) => void;
  onMinBathsChange: (min: Scalars["space"]["minBathrooms"]) => void;
  onMapMove: (params: { zoom: number; lat: number; lng: number }) => void;
  reset: (commit: boolean) => void;
  onSearchRadiusChange: (value: number) => void;
  onSearchRadiusEnabledChange: (enabled: boolean) => void;
};

export const removeDefaults = (
  query: UrlRealEstateQuery
): Partial<UrlRealEstateQuery> => {
  const defaults = UrlRealEstateQuerySchema.parse({});
  return omitBy(query, (v, k) => equals(defaults[k], v));
};

const useRealEstateQuery = (): UseRealEstateQueryReturn => {
  const router = useRouter();
  const $ = useRealEstateIndexPageState();

  $.query.use();
  $.stagedQuery.use();

  const commit = () => {
    const qs = generateQueryString($.stagedQuery.get());
    router.push(`${router.pathname}${qs}`, "", { shallow: true });
  };

  const patch: UseRealEstateQueryReturn["patch"] = (data) => {
    const nextQuery = update($.stagedQuery.get(), { $merge: data });
    $.stagedQuery.set(nextQuery);
  };

  const query = $.query.get();
  const stagedQuery = $.stagedQuery.get();

  return {
    query,
    stagedQuery,
    queryString: generateQueryString($.stagedQuery.get()),

    patch,
    commit,

    has: (key) => has(queryToUrlQuery(query), key),
    activeFilters: countActiveProps(query),

    isQuickFilterOn: useCallback(
      (key, value) => stagedQuery[key].includes(value),
      [stagedQuery]
    ),

    onQuickFilterChange(key, value, on) {
      patch({
        [key]: update(
          query[key],
          on
            ? { $push: [value] }
            : { $apply: (p: any) => p.filter((v: any) => v !== value) }
        ),
        page: 1
      });
      commit();
    },

    onValueChange: (param, value) => {
      patch({ [param]: value, page: 1 });
      commit();
    },

    onPageChange: (page) => {
      patch({ page });
      commit();
    },

    createLink(page, sort) {
      return `/real-estate${generateQueryString(query, page, sort)}`;
    },

    onMinBedsChange: (min) => {
      patch({
        "min-bedrooms": min,
        ...(query["max-bedrooms"]
          ? { "max-bedrooms": min === 0 ? null : min }
          : {})
      });
      commit();
    },

    onMaxBedsChange: (max) => {
      patch({ "max-bedrooms": max, page: 1 });
      commit();
    },

    onPriceRangeChange: (min, max) => {
      patch({ "min-price": min, "max-price": max, page: 1 });
      commit();
    },

    onAvailabilityChange: (value) => {
      patch({
        availability: value,
        "min-price": 0,
        "max-price": null,
        page: 1
      });
      commit();
    },

    onCheckedChange: (key, value, checked) => {
      patch({
        [key]: update(
          query[key],
          checked
            ? { $push: [value] }
            : { $apply: (p: any) => p.filter((v: any) => v !== value) }
        ),
        page: 1
      });
      commit();
    },

    reset: (c) => {
      $.stagedQuery.set(RealEstateQuerySchema.parse({}));
      if (c) {
        commit();
      }
    },

    onMapMove: useDebouncedCallback(({ zoom, lat, lng }) => {
      // patch({ zoom, lat, lng });
      // commit();
    }, 500),

    onSearchRadiusChange: (value) => {
      patch({ radius: value, page: 1 });
      commit();
    },

    onSearchRadiusEnabledChange: (enabled) => {
      patch({ "radius-enabled": enabled ? "true" : "false", page: 1 });
      commit();
    },

    onMinBathsChange: (min) => {
      patch({ "min-bathrooms": min, page: 1 });
      commit();
    }
  };
};

// const expires = new Date();
// expires.setSeconds(expires.getSeconds() + 60 * 5);
// setCookie("referer", qs ? `/real-estate${qs}` : "", {
//   expires,
//   path: "/"
// });

export default useRealEstateQuery;
