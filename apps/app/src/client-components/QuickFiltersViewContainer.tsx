"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { QuickFilter } from "@rems/types";
import { QuickFilters } from "@rems/ui";

type Props = {
  filters: QuickFilter[];
};

const QuickFiltersViewContainer = ({ filters }: Props) => {
  const { isQuickFilterOn, onQuickFilterChange } = useRealEstateQuery();
  return (
    <QuickFilters
      isOn={isQuickFilterOn}
      filters={filters}
      onChange={onQuickFilterChange}
    />
  );
};

export default QuickFiltersViewContainer;
