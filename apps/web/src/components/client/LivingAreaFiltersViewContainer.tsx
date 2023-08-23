"use client";

import React from "react";
import { LivingAreaFilters } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { MAX_LIVING_AREA_SIZES, MIN_LIVING_AREA_SIZES } from "../../constants";

type Props = {};

const LivingAreaFiltersViewContainer = ({}: Props) => {
  const { onValueChange, stagedQuery } = useRealEstateQuery();

  return (
    <LivingAreaFilters
      minLivingArea={stagedQuery["min-living-area"]}
      maxLivingArea={stagedQuery["max-living-area"]}
      minLivingAreaSizes={MIN_LIVING_AREA_SIZES}
      maxLivingAreaSizes={MAX_LIVING_AREA_SIZES}
      onMinLivingAreaChange={(value) => onValueChange("min-living-area", value)}
      onMaxLivingAreaChange={(value) => onValueChange("max-living-area", value)}
    />
  );
};

export default LivingAreaFiltersViewContainer;
