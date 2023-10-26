"use client";

import React, { useState } from "react";
import { FilterDialog, PropertyFilters } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import { resetRealEstateQuery, useActiveFiltersCount } from "@/state";
import { useDispatch } from "react-redux";

type Props = { children: React.ReactNode };

const FilterDialogViewContainer = ({ children }: Props) => {
  const dispatch = useDispatch();
  const count = useActiveFiltersCount();
  const { data, isLoading } = useProperties();

  const [open, setOpen] = useState(false);

  return (
    <FilterDialog
      activeFilters={count}
      loading={isLoading}
      onOpenChange={setOpen}
      open={open}
      count={data?.pagination.total}
      onClearClick={() => dispatch(resetRealEstateQuery())}
    >
      <PropertyFilters.Root>{children}</PropertyFilters.Root>
    </FilterDialog>
  );
};

export default FilterDialogViewContainer;
