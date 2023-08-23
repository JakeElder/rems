"use client";

import React from "react";
import { OutdoorFeatureFilters } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";

type Props = Pick<
  React.ComponentProps<typeof OutdoorFeatureFilters>,
  "features"
>;

const OutdoorFeatureFiltersViewContainer = ({ features }: Props) => {
  const { onCheckedChange, stagedQuery } = useRealEstateQuery();

  return (
    <OutdoorFeatureFilters
      features={features}
      onChange={(value, checked) =>
        onCheckedChange("outdoor-features", value, checked)
      }
      isChecked={(value) => stagedQuery["outdoor-features"].includes(value)}
    />
  );
};

export default OutdoorFeatureFiltersViewContainer;
