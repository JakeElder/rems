"use client";

import React from "react";
import { LotFeatureFilters } from "@rems/ui";
import useFilterArrayProps from "@/hooks/use-filter-array-props";
import { useActiveLotFeatureFilters } from "@/state";

type Props = Pick<React.ComponentProps<typeof LotFeatureFilters>, "features">;

const LotFeatureFiltersViewContainer = ({ features }: Props) => {
  const filters = useActiveLotFeatureFilters();
  const { isChecked, onChange } = useFilterArrayProps("lotFeatures", filters);

  return (
    <LotFeatureFilters
      features={features}
      onChange={onChange}
      isChecked={isChecked}
    />
  );
};

export default LotFeatureFiltersViewContainer;
