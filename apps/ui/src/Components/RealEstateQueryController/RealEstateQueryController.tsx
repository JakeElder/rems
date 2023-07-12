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
  loading: boolean;
} & LoadingState;

type LoadingState =
  | { initialLoad: true; result: null; loading: boolean }
  | { initialLoad: false; result: GetPropertiesResult; loading: boolean };

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

  const [loader, setLoader] = useState<LoadingState>({
    initialLoad: true,
    loading: true,
    result: null
  });

  const get: (
    q: RealEstateQuery
  ) => Promise<GetPropertiesResult> = async () => {
    const string = generateQueryString(query);
    const q = `?${string}`;
    const res = await fetch(`/properties${q === "?" ? "" : q}`);
    return res.json();
  };

  const { scrollTo } = useScrollTo();

  useEffect(() => {
    setLoader(
      update(loader, {
        loading: { $set: true }
      })
    );

    get(query).then((result) => {
      if (eq(query, result.query)) {
        setLoader({
          initialLoad: false,
          loading: false,
          result
        });
        scrollTo(0);
      }
    });
  }, [query]);

  const has: RealEstateQueryContext["has"] = (param) => {
    return param in queryWithoutDefaults;
  };

  const activeFilters = [
    has("property-type"),
    has("min-price") || has("max-price"),
    has("min-bedrooms") || has("max-bedrooms"),
    has("min-bathrooms"),
    has("view-types"),
    has("indoor-features"),
    has("outdoor-features"),
    has("lot-features"),
    has("min-living-area") || has("max-living-area"),
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

        initialLoad: loader.initialLoad as any,
        loading: loader.loading,
        result: loader.result
      }}
    >
      {children}
    </RealEstateQueryContext.Provider>
  );
};

export default RealEstateQueryController;
