"use client";

import React, { useState } from "react";
import { FilterDialog, PropertyFilters } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import { useActiveFiltersCount } from "@/state";

type Props = { children: React.ReactNode };

const FilterDialogViewContainer = ({ children }: Props) => {
  const count = useActiveFiltersCount();
  // const { activeFilters, reset, serverQuery } = useRealEstateQuery();
  // const { data, isLoading } = useProperties(serverQuery);

  const [open, setOpen] = useState(false);

  return (
    <FilterDialog
      activeFilters={count}
      loading={true}
      onOpenChange={setOpen}
      open={open}
      count={0}
      onClearClick={() => {}}
    >
      <PropertyFilters.Root>{children}</PropertyFilters.Root>
    </FilterDialog>
  );
};

export default FilterDialogViewContainer;
