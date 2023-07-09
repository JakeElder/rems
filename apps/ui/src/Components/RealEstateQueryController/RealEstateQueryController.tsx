"use client";

import { CheckedState } from "@radix-ui/react-checkbox";
import {
  GetPropertiesResult,
  RealEstateQuery,
  realEstateQuerySchema
} from "@rems/types";
import React, { createContext, useContext } from "react";
import qs from "query-string";
import update from "immutability-helper";
import { omitBy, equals } from "remeda";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  query: RealEstateQuery;
  result: GetPropertiesResult;
  children: React.ReactNode;
};

type RealEstateQueryContext = {
  query: RealEstateQuery;
  result: GetPropertiesResult;
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

const RealEstateQueryController = ({ query, result, children }: Props) => {
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
        result,
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
        }
      }}
    >
      {children}
    </RealEstateQueryContext.Provider>
  );
};

export default RealEstateQueryController;
