"use client";

import React from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { QuickFilters } from "@rems/ui";

type Props = Pick<React.ComponentProps<typeof QuickFilters>, "filters">;

const QuickFiltersViewContainer = ({ filters }: Props) => {
  const { isQuickFilterOn, onQuickFilterChange, stagedQuery } =
    useRealEstateQuery();
  return (
    <QuickFilters
      isOn={isQuickFilterOn}
      filters={filters}
      onChange={onQuickFilterChange}
    />
  );
};

export default QuickFiltersViewContainer;
