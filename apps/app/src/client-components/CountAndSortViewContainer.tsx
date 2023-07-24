"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { CountAndSort } from "@rems/ui";
import useSWR from "swr";
import getProperties from "../utils/get-properties";

type Props = {};

const CountAndSortViewContainer = ({}: Props) => {
  const { query, queryString, onValueChange } = useRealEstateQuery();
  const key = queryString || "?";
  const { data, isLoading } = useSWR(key, getProperties, {
    keepPreviousData: true
  });

  return (
    <CountAndSort
      loading={isLoading}
      sort={query["sort"]}
      listings={data?.pagination.total}
      onChange={(sort) => onValueChange("sort", sort)}
    />
  );
};

export default CountAndSortViewContainer;
