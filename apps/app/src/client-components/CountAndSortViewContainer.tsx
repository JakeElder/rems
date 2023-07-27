"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { CountAndSort } from "@rems/ui";
import useProperties from "../hooks/use-properties";

type Props = {};

const CountAndSortViewContainer = ({}: Props) => {
  const { query, onValueChange } = useRealEstateQuery();
  const { data, isLoading } = useProperties();

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
