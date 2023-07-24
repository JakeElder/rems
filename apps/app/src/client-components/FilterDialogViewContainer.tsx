"use client";

import React, { useState } from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { FilterDialog, PropertyFilters } from "@rems/ui";
import useSWR from "swr";
import getProperties from "../utils/get-properties";

type Props = { children: React.ReactNode };

const FilterDialogViewContainer = ({ children }: Props) => {
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
    >
      <PropertyFilters.Root>{children}</PropertyFilters.Root>
    </FilterDialog>
  );
};

export default FilterDialogViewContainer;
