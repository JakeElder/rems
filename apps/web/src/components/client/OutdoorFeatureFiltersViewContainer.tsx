"use client";

import React from "react";
import { OutdoorFeatureFilters } from "@rems/ui";
import { useActiveOutdoorFeatureFilters } from "@/state";
import useFilterArrayProps from "@/hooks/use-filter-array-props";

type Props = Pick<
  React.ComponentProps<typeof OutdoorFeatureFilters>,
  "features"
>;

const OutdoorFeatureFiltersViewContainer = ({ features }: Props) => {
  const filters = useActiveOutdoorFeatureFilters();
  const { isChecked, onChange } = useFilterArrayProps(
    "outdoorFeatures",
    filters
  );

  return (
    <OutdoorFeatureFilters
      features={features}
      onChange={onChange}
      isChecked={isChecked}
    />
  );
};

export default OutdoorFeatureFiltersViewContainer;
