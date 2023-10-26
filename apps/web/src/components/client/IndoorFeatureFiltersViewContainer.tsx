"use client";

import React from "react";
import { IndoorFeatureFilters } from "@rems/ui";
import { useActiveIndoorFeatureFilters } from "@/state";
import useFilterArrayProps from "@/hooks/use-filter-array-props";

type Props = Pick<
  React.ComponentProps<typeof IndoorFeatureFilters>,
  "features"
>;

const IndoorFeatureFiltersViewContainer = ({ features }: Props) => {
  const filters = useActiveIndoorFeatureFilters();
  const { isChecked, onChange } = useFilterArrayProps(
    "indoorFeatures",
    filters
  );

  return (
    <IndoorFeatureFilters
      features={features}
      onChange={onChange}
      isChecked={isChecked}
    />
  );
};

export default IndoorFeatureFiltersViewContainer;
