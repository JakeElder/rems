"use client";

import React from "react";
import { CountAndSort } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import useProperties from "@/hooks/use-properties";

type Props = {};

const CountAndSortViewContainer = ({}: Props) => {
  const { stagedQuery, onValueChange, serverQuery } = useRealEstateQuery();
  const { data, isLoading } = useProperties(serverQuery);

  return (
    <CountAndSort
      loading={isLoading}
      sort={stagedQuery["sort"]}
      listings={data?.pagination.total}
      onChange={(sort) => onValueChange("sort", sort)}
    />
  );
};

export default CountAndSortViewContainer;
