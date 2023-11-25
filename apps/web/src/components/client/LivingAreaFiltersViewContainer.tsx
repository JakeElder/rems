"use client";

import React, { useCallback } from "react";
import { LivingAreaFilters } from "@rems/ui";
import { MAX_LIVING_AREA_SIZES, MIN_LIVING_AREA_SIZES } from "../../constants";
import { useDispatch } from "react-redux";
import { useStagedRealEstateQuery } from "@/state";
import {
  commitRealEstateQuery,
  setSpaceRequirements
} from "@rems/state/app/actions";

type ViewProps = React.ComponentProps<typeof LivingAreaFilters>;
type Props = {};

const LivingAreaFiltersViewContainer = ({}: Props) => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  const onMinLivingAreaChange: ViewProps["onMinLivingAreaChange"] = useCallback(
    (minLivingArea) => {
      dispatch(setSpaceRequirements({ role: "USER", data: { minLivingArea } }));
      dispatch(commitRealEstateQuery());
    },
    []
  );

  const onMaxLivingAreaChange: ViewProps["onMaxLivingAreaChange"] = useCallback(
    (maxLivingArea) => {
      dispatch(setSpaceRequirements({ role: "USER", data: { maxLivingArea } }));
      dispatch(commitRealEstateQuery());
    },
    []
  );

  return (
    <LivingAreaFilters
      minLivingArea={stagedQuery.space.minLivingArea}
      maxLivingArea={stagedQuery.space.maxLivingArea}
      minLivingAreaSizes={MIN_LIVING_AREA_SIZES}
      maxLivingAreaSizes={MAX_LIVING_AREA_SIZES}
      onMinLivingAreaChange={onMinLivingAreaChange}
      onMaxLivingAreaChange={onMaxLivingAreaChange}
    />
  );
};

export default LivingAreaFiltersViewContainer;
