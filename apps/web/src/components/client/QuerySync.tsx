"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { replaceRealEstateQuery, useRealEstateQuery } from "@/state";
import { fromSearchParams, generateQueryString } from "@rems/utils/query";
import { ArrayFilters } from "@rems/types";
import equal from "fast-deep-equal";
import { useDispatch } from "react-redux";

type Props = {
  children: React.ReactNode;
  filters: ArrayFilters;
};

const QuerySync = ({ children, filters }: Props) => {
  const query = useRealEstateQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const qs = generateQueryString(query);
    router.push(`/real-estate${qs}`, { scroll: false });
  }, [query]);

  useEffect(() => {
    if (searchParams) {
      const url = fromSearchParams(Object.fromEntries(searchParams), filters);
      if (!equal(query, url)) {
        dispatch(replaceRealEstateQuery(url));
      }
    }
  }, [searchParams]);

  return children;
};

export default QuerySync;
