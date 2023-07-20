"use client";

import React, { useState } from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { FilterDialog } from "@rems/ui";
import useSWR from "swr";
import getProperties from "../utils/get-properties";

type Props = {};

const FilterDialogViewContainer = ({}: Props) => {
  const { queryString, activeFilters, reset } = useRealEstateQuery();
  const key = queryString || "?";
  const { data, isLoading } = useSWR(key, getProperties, {
    keepPreviousData: true
  });

  const [open, setOpen] = useState(false);

  return (
    <FilterDialog
      activeFilters={activeFilters}
      loading={isLoading}
      onOpenChange={setOpen}
      open={open}
      count={data?.pagination.total}
      onClearClick={() => reset()}
    />
  );
};

export default FilterDialogViewContainer;
