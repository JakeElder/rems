"use client";

import {
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
  onPageChange: (page: RealEstateQuery["page"]) => void;
  createLink: (page?: number, sort?: RealEstateQuery["sort"]) => string;
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
  const string = qs.stringify(final, { arrayFormat: "bracket" });
  return string ? `?${string}` : "";
};

const useRealEstateQuery = (): UseRealEstateQueryReturn => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const commit = (query: RealEstateQuery) => {
    const qs = generateQueryString(query);
    router.push(`${pathname}${qs}`);

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + 60 * 5);
    setCookie("referer", qs ? `/real-estate?${qs}` : "", {
      expires,
      path: "/"
    });
  };

  const q = qs.parse(params.toString(), { arrayFormat: "bracket" });
  const query = realEstateQuerySchema.parse(q);
  const queryString = generateQueryString(query);

  return {
    query,
    queryString,

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
    }
  };
};

export default useRealEstateQuery;
