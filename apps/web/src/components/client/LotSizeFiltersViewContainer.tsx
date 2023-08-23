"use client";

import React from "react";
import { LotSizeFilters } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { MAX_LOT_SIZES, MIN_LOT_SIZES } from "../../constants";

type Props = {};

const LotSizeFiltersViewContainer = ({}: Props) => {
  const { onValueChange, stagedQuery } = useRealEstateQuery();
  return (
    <LotSizeFilters
      minLotSize={stagedQuery["min-lot-size"]}
      maxLotSize={stagedQuery["max-lot-size"]}
      minLotSizes={MIN_LOT_SIZES}
      maxLotSizes={MAX_LOT_SIZES}
      onMinLotSizeChange={(value) => onValueChange("min-lot-size", value)}
      onMaxLotSizeChange={(value) => onValueChange("max-lot-size", value)}
    />
  );
};

export default LotSizeFiltersViewContainer;
