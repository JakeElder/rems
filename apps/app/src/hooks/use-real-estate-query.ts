"use client";

import {
  PartialRealEstateQuery,
  QuickFilterQueryKey,
  RealEstateQuery,
  SearchParams,
  ServerRealEstateQuery
} from "@rems/types";
import { useRouter } from "next/router";
import qs from "query-string";
import update from "immutability-helper";
import { omitBy, equals, flatten } from "remeda";
import { setCookie } from "typescript-cookie";
import {
  RealEstateQuerySchema,
  ServerRealEstateQuerySchema
} from "@rems/schemas";
import { useDebouncedCallback } from "use-debounce";
import useRealEstateIndexPageState from "./use-real-estate-index-page-state";

type UseRealEstateQueryReturn = {
  query: RealEstateQuery;
  serverQuery: ServerRealEstateQuery;
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
  onMapZoomChange: (zoom: number) => void;
  onSearchOriginChange: (id: string, lng: number, lat: number) => void;
  onMapMove: (lat: number, lng: number) => void;
  reset: () => void;
  isReady: boolean;
  onSearchRadiusChange: (value: number) => void;
  onSearchRadiusEnabledChange: (enabled: boolean) => void;
};

export const removeDefaults = (
  query: PartialRealEstateQuery
): PartialRealEstateQuery => {
  const defaults = RealEstateQuerySchema.parse({});
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

const searchParamsToPartialQuery = (params: SearchParams): RealEstateQuery => {
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
};

const useRealEstateQuery = (): UseRealEstateQueryReturn => {
  const router = useRouter();
  const pageState = useRealEstateIndexPageState();

  const commit = (query: PartialRealEstateQuery) => {
    const qs = generateQueryString(query);
    router.push(`${router.pathname}${qs}`, "", { shallow: true });

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + 60 * 5);
    setCookie("referer", qs ? `/real-estate${qs}` : "", {
      expires,
      path: "/"
    });
  };

  const query = searchParamsToPartialQuery(router.query);
  const queryString = generateQueryString(query);

  const defaults = RealEstateQuerySchema.parse({});
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

  const onMapZoomChange = useDebouncedCallback<
    UseRealEstateQueryReturn["onMapZoomChange"]
  >((zoom) => {
    const nextQuery = update(query, { "map-zoom": { $set: zoom } });
    commit(nextQuery);
  }, 500);

  const onMapMove = useDebouncedCallback<UseRealEstateQueryReturn["onMapMove"]>(
    (lat, lng) => {
      const nextQuery = update(query, {
        "map-lat": { $set: lat },
        "map-lng": { $set: lng }
      });
      commit(nextQuery);
    },
    500
  );

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

  const serverQuery = ServerRealEstateQuerySchema.parse({
    ...query,
    ...bounds
  });

  return {
    isReady: router.isReady,

    query,
    serverQuery,
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

    onSearchOriginChange: (id, lng, lat) => {
      const nextQuery = update(query, {
        "search-origin-id": { $set: id },
        "search-origin-lat": { $set: lat },
        "search-origin-lng": { $set: lng }
      });
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
      commit(RealEstateQuerySchema.parse({}));
    },

    commit,
    onMapZoomChange,
    onMapMove,

    onSearchRadiusChange: (value) => {
      const nextQuery = update(query, {
        "search-radius": { $set: value },
        page: { $set: 1 }
      });
      commit(nextQuery);
    },

    onSearchRadiusEnabledChange: (enabled) => {
      const nextQuery = update(query, {
        "search-radius-enabled": { $set: enabled ? "true" : "false" },
        page: { $set: 1 }
      });
      commit(nextQuery);
    },

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
