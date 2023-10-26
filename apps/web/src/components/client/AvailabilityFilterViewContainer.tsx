"use client";

import React from "react";
import { AvailabilityFilter } from "@rems/ui";
import { useStagedRealEstateQuery } from "@/state";
import useAvailabilityFilterProps from "@/hooks/use-availability-filter-props";

type Props = {};

const AvailabilityFilterViewContainer = ({}: Props) => {
  const stagedQuery = useStagedRealEstateQuery();
  const { onChange } = useAvailabilityFilterProps();

  return (
    <AvailabilityFilter
      value={stagedQuery["budgetAndAvailability"]["type"]}
      onChange={onChange}
    />
  );
};

export default AvailabilityFilterViewContainer;
