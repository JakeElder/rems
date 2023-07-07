"use client";

import { CheckedState } from "@radix-ui/react-checkbox";
import { RealEstateQuery, realEstateQuerySchema } from "@rems/types";
import React, { createContext, useContext } from "react";
import qs from "query-string";
import update from "immutability-helper";
import { omitBy, equals } from "remeda";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  query: RealEstateQuery;
  count: number;
  children: React.ReactNode;
};

type RealEstateQueryContext = {
  query: RealEstateQuery;
  count: number;
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
  onMinBedsChange: (min: RealEstateQuery["min-bedrooms"]) => void;
  onMaxBedsChange: (max: RealEstateQuery["max-bedrooms"]) => void;
  onMinBathsChange: (min: RealEstateQuery["min-bathrooms"]) => void;
  reset: () => void;
};

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

const RealEstateQueryController = ({ query, count, children }: Props) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const commit = (query: RealEstateQuery) => {
    const string = generateQueryString(query);
    push(`${pathname}?${string}`);
  };

  return (
    <RealEstateQueryContext.Provider
      value={{
        query,
        count,
        onCheckedChange: (param, value, state) => {
          const checked = state !== "indeterminate" && state;
          const nextQuery = update(query, {
            [param]: checked
              ? { $push: [value] }
              : { $apply: (p: any) => p.filter((v: any) => v !== value) }
          });
          commit(nextQuery);
        },

        onPriceRangeChange: (min, max) => {
          const nextQuery = update(query, {
            "min-price": { $set: min },
            "max-price": { $set: max }
          });
          commit(nextQuery);
        },

        onMinBedsChange: (min) => {
          const nextQuery = update(query, {
            "min-bedrooms": { $set: min },
            ...(query["max-bedrooms"]
              ? { "max-bedrooms": { $set: min === 0 ? null : min } }
              : {})
          });
          commit(nextQuery);
        },

        onMaxBedsChange: (max) => {
          const nextQuery = update(query, { "max-bedrooms": { $set: max } });
          commit(nextQuery);
        },

        onMinBathsChange: (min) => {
          const nextQuery = update(query, { "min-bathrooms": { $set: min } });
          commit(nextQuery);
        },

        onValueChange: (param, value) => {
          const nextQuery = update(query, { [param]: { $set: value } });
          commit(nextQuery);
        },

        reset: () => {
          commit(realEstateQuerySchema.parse({}));
        }
      }}
    >
      {children}
    </RealEstateQueryContext.Provider>
  );
};

export default RealEstateQueryController;
