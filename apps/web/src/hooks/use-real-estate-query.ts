"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  QuickFilterQueryKey,
  RealEstateQuery,
  SearchParams,
  ServerRealEstateQuery
} from "@rems/types";
import { useRouter } from "next/router";
import qs from "query-string";
import update from "immutability-helper";
import { omitBy, equals, flatten } from "remeda";
import { RealEstateQuerySchema } from "@rems/schemas";
import { useDebouncedCallback } from "use-debounce";
import useRealEstateIndexPageState from "./use-real-estate-index-page-state";
import { z } from "zod";

type UseRealEstateQueryReturn = {
  query: RealEstateQuery;
  stagedQuery: RealEstateQuery;
  serverQuery: ServerRealEstateQuery;
  queryString: string;
  freeze: () => void;
  unfreeze: (commit?: boolean) => void;
  patch: (query: Partial<RealEstateQuery>) => void;
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
  onMapZoomChange: (zoom: number) => void;
  onSearchOriginChange: (id: string, lng: number, lat: number) => void;
  onMapMove: (lat: number, lng: number) => void;
  reset: () => void;
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

type ArrayKey = keyof z.infer<typeof RealEstateQuerySchema.Arrays>;

const searchParamsToQuery = (params: SearchParams): RealEstateQuery => {
  const arrayKeys: ArrayKey[] = [
    "indoor-features",
    "lot-features",
    "outdoor-features",
    "property-types",
    "view-types"
  ];

  const p = Object.keys(params).reduce((acc, key) => {
    const k = key.replace(/\[\]$/, "") as ArrayKey;
    const val = arrayKeys.includes(k)
      ? flatten([...[params[key]]])
      : params[key];
    return { ...acc, [k]: val };
  }, {});

  return RealEstateQuerySchema.URL.parse(p);
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
  const pageState = useRealEstateIndexPageState();

  const [query, setQuery] = useState(searchParamsToQuery(router.query));
  const [stagedQuery, setStagedQuery] = useState(query);
  const [frozen, setFrozen] = useState(false);
  const $stagedQuery = useRef(stagedQuery);

  useEffect(() => {
    const nextQuery = searchParamsToQuery(router.query);
    setQuery(nextQuery);
    setStagedQuery(nextQuery);
  }, [router.query]);

  const commit = () => {
    const qs = generateQueryString($stagedQuery.current);
    router.push(`${router.pathname}${qs}`, "", { shallow: true });
  };

  const patch: UseRealEstateQueryReturn["patch"] = (data) => {
    const nextQuery = update($stagedQuery.current, { $merge: data });
    $stagedQuery.current = nextQuery;
    setStagedQuery(nextQuery);
  };

  const bounds = (() => {
    if (pageState === null || !process.env.NEXT_PUBLIC_ENABLE_LOCATION_RADIUS) {
      return {};
    }

    const b = pageState.mapBounds.get();

    if (b === null) {
      return {};
    }

    // TODO: Change to map-size
    return {
      "map-bound-sw-lng": b.sw.lng,
      "map-bound-sw-lat": b.sw.lat,
      "map-bound-ne-lng": b.ne.lng,
      "map-bound-ne-lat": b.ne.lat
    };
  })();

  return {
    isReady: router.isReady,

    query,
    stagedQuery,
    serverQuery: RealEstateQuerySchema.Server.parse({
      ...query,
      ...bounds
    }),
    queryString: generateQueryString(query),

    freeze: () => setFrozen(true),

    unfreeze: (cmt) => {
      setFrozen(false);
      cmt && commit();
    },

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

    onSearchOriginChange: (id, lng, lat) => {
      patch({ "origin-id": id, "origin-lat": lat, "origin-lng": lng });
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

    reset: () => {
      $stagedQuery.current = RealEstateQuerySchema.URL.parse({});
      commit();
    },

    patch,

    onMapZoomChange: useDebouncedCallback((zoom) => {
      patch({ zoom });
      commit();
    }, 500),

    onMapMove: useDebouncedCallback((lat, lng) => {
      patch({ lat, lng });
      commit();
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
