"use client";

import { useCallback } from "react";
import {
  QuickFilterQueryKey,
  RealEstateQuery,
  ServerRealEstateQuery
} from "@rems/types";
import { useRouter } from "next/router";
import qs from "query-string";
import update from "immutability-helper";
import { omitBy, equals } from "remeda";
import { RealEstateQuerySchema } from "@rems/schemas";
import { useDebouncedCallback } from "use-debounce";
import useRealEstateIndexPageState from "./use-real-estate-index-page-state";

type UseRealEstateQueryReturn = {
  query: RealEstateQuery;
  stagedQuery: RealEstateQuery;
  serverQuery: ServerRealEstateQuery;
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
  onMapMove: (params: { zoom: number; lat: number; lng: number }) => void;
  reset: (commit: boolean) => void;
  isReady: boolean;
  onSearchRadiusChange: (value: number) => void;
  onSearchRadiusEnabledChange: (enabled: boolean) => void;
};

export const removeDefaults = (
  query: Partial<RealEstateQuery>
): Partial<RealEstateQuery> => {
  const defaults = RealEstateQuerySchema.URL.parse({});
  return omitBy(query, (v, k) => equals(defaults[k], v));
};

export const generateQueryString = (
  query: Partial<RealEstateQuery>,
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

const has = (query: RealEstateQuery, param: keyof RealEstateQuery) => {
  const defaults = RealEstateQuerySchema.URL.parse({});
  const queryWithoutDefaults = omitBy(query, (v, k) => equals(defaults[k], v));
  return param in queryWithoutDefaults;
};

const countActiveFilters = (query: RealEstateQuery) => {
  const h = (k: keyof RealEstateQuery) => has(query, k);
  return [
    ...query["property-types"],
    h("min-price") || h("max-price"),
    h("min-bedrooms") || h("max-bedrooms"),
    h("min-bathrooms"),
    ...query["view-types"],
    ...query["indoor-features"],
    ...query["outdoor-features"],
    ...query["lot-features"],
    h("min-living-area") || h("max-living-area"),
    h("min-lot-size") || h("max-lot-size")
  ].filter((i) => i).length;
};

const useRealEstateQuery = (): UseRealEstateQueryReturn => {
  const router = useRouter();
  const $ = useRealEstateIndexPageState();

  $.query.use();
  $.stagedQuery.use();
  $.mapBounds.use();

  const commit = () => {
    const qs = generateQueryString($.stagedQuery.get()!);
    router.push(`${router.pathname}${qs}`, "", { shallow: true });
  };

  const patch: UseRealEstateQueryReturn["patch"] = (data) => {
    const nextQuery = update($.stagedQuery.get()!, { $merge: data });
    $.stagedQuery.set(nextQuery);
  };

  const bounds = (() => {
    const b = $.mapBounds.get();

    if (b === null) {
      return {};
    }

    return {
      "map-bound-sw-lng": b.sw.lng,
      "map-bound-sw-lat": b.sw.lat,
      "map-bound-ne-lng": b.ne.lng,
      "map-bound-ne-lat": b.ne.lat
    };
  })();

  const query = $.query.get()!;
  const stagedQuery = $.stagedQuery.get()!;

  return {
    isReady: router.isReady,

    query,
    stagedQuery,
    serverQuery: RealEstateQuerySchema.Server.parse({ ...query, ...bounds }),
    queryString: generateQueryString(query),

    patch,
    commit,

    has: (key) => has(query, key),
    activeFilters: countActiveFilters(query),

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
      $.stagedQuery.set(RealEstateQuerySchema.URL.parse({}));
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
