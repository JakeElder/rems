"use client";

import React, { useState } from "react";
import { FilterDialog, PropertyFilters } from "@rems/ui";
import useProperties from "@/hooks/use-properties";

type Props = { children: React.ReactNode };

const FilterDialogViewContainer = ({ children }: Props) => {
  return null;
  const { activeFilters, reset, serverQuery } = useRealEstateQuery();
  const { data, isLoading } = useProperties(serverQuery);

  const [open, setOpen] = useState(false);

  return (
    <FilterDialog
      activeFilters={activeFilters}
      loading={isLoading}
      onOpenChange={setOpen}
      open={open}
      count={data?.pagination.total}
      onClearClick={() => reset(true)}
    >
      <PropertyFilters.Root>{children}</PropertyFilters.Root>
    </FilterDialog>
  );
};

export default FilterDialogViewContainer;
