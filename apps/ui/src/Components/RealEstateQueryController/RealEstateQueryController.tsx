"use client";

import { CheckedState } from "@radix-ui/react-checkbox";
import {
  GetPropertiesResult,
  RealEstateQuery,
  realEstateQuerySchema
} from "@rems/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import qs from "query-string";
import update from "immutability-helper";
import { omitBy, equals } from "remeda";
import { usePathname } from "next/navigation";
import eq from "fast-deep-equal";
import useScrollTo from "react-spring-scroll-to-hook";
import { setCookie } from "typescript-cookie";

type Props = {
  query: RealEstateQuery;
  children: React.ReactNode;
};

type RealEstateQueryContext = {
  query: RealEstateQuery;
  has: (param: keyof RealEstateQuery) => boolean;
  activeFilters: number;
  onCheckedChange: (
    param: keyof RealEstateQuery,
    value: string,
    state: CheckedState
  ) => void;
  onAvailabilityChange: (availability: RealEstateQuery["availability"]) => void;
  onValueChange: (
    param: keyof RealEstateQuery,
    value: string | number | null
  ) => void;
  onPriceRangeChange: (
    min: RealEstateQuery["min-price"],
    max: RealEstateQuery["max-price"]
  ) => void;
  onPageChange: (page: RealEstateQuery["page"]) => void;
  onMinBedsChange: (min: RealEstateQuery["min-bedrooms"]) => void;
  onMaxBedsChange: (max: RealEstateQuery["max-bedrooms"]) => void;
  onMinBathsChange: (min: RealEstateQuery["min-bathrooms"]) => void;
  reset: () => void;
  state: LoadingState;
};

type InitialisingState = {
  initialLoad: true;
  loading: true;
  result: null;
  query: null;
};

type LoadedState = {
  initialLoad: false;
  result: GetPropertiesResult;
  query: RealEstateQuery;
  loading: boolean;
};

type LoadingState = InitialisingState | LoadedState;

const RealEstateQueryContext = createContext<RealEstateQueryContext | null>(
  null
);

export const useRealEstateQuery = () => {
  const handlers = useContext(RealEstateQueryContext);
  if (!handlers) {
    throw new Error();
  }
  return handlers;
};

export const generateQueryString = (
  query: RealEstateQuery,
  page?: number,
  sort?: RealEstateQuery["sort"]
) => {
  const withForced = {
    ...query,
    ...(page ? { page } : {}),
    ...(sort ? { sort } : {})
  };

  const defaults = realEstateQuerySchema.parse({});
  const final = omitBy(withForced, (v, k) => equals(defaults[k], v));
  return qs.stringify(final, { arrayFormat: "bracket" });
};

const RealEstateQueryController = ({
  query: initialQuery,
  children
}: Props) => {
  const [query, setQuery] = useState<RealEstateQuery>(initialQuery);
  const pathname = usePathname();

  const defaults = realEstateQuerySchema.parse({});
  const queryWithoutDefaults = omitBy(query, (v, k) => equals(defaults[k], v));

  const commit = (query: RealEstateQuery) => {
    React.startTransition(() => setQuery(query));
    const string = generateQueryString(query);
    const q = `?${string}`;
    window.history.pushState("", "", `${pathname}${q === "?" ? "" : q}`);
  };

  const [loadingState, setLoadingState] = useState<LoadingState>({
    initialLoad: true,
    loading: true,
    result: null,
    query: null
  });

  const get: (
    q: RealEstateQuery
  ) => Promise<GetPropertiesResult> = async () => {
    const qs = generateQueryString(query);
    const res = await fetch(`/api/properties${qs ? `?${qs}` : ""}`);
    return res.json();
  };

  const { scrollTo } = useScrollTo();

  useEffect(() => {
    setLoadingState(update(loadingState, { loading: { $set: true } }));

    get(query).then((result) => {
      if (eq(query, result.query)) {
        setLoadingState({
          initialLoad: false,
          loading: false,
          result,
          query
        });

        const qs = generateQueryString(query);

        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + 60 * 5);

        setCookie("referer", qs ? `/real-estate?${qs}` : "", {
          expires,
          path: "/"
        });

        scrollTo(0);
      }
    });
  }, [query]);

  const has: RealEstateQueryContext["has"] = (param) => {
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

  return (
    <RealEstateQueryContext.Provider
      value={{
        query,
        activeFilters,
        onCheckedChange: (param, value, state) => {
          const checked = state !== "indeterminate" && state;
          const nextQuery = update(query, {
            [param]: checked
              ? { $push: [value] }
              : { $apply: (p: any) => p.filter((v: any) => v !== value) },
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

        onMinBathsChange: (min) => {
          const nextQuery = update(query, {
            "min-bathrooms": { $set: min },
            page: { $set: 1 }
          });
          commit(nextQuery);
        },

        onAvailabilityChange: (value) => {
          const nextQuery = update(query, {
            availability: { $set: value },
            "min-price": { $set: 0 },
            "max-price": { $set: null }
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

        reset: () => {
          commit(realEstateQuerySchema.parse({}));
        },

        onPageChange: (page) => {
          const nextQuery = update(query, { page: { $set: page } });
          commit(nextQuery);
        },

        has,

        state: loadingState
      }}
    >
      {children}
    </RealEstateQueryContext.Provider>
  );
};

export default RealEstateQueryController;
