"use client";

import React from "react";
import { AvailabilityFilterPopover } from "@rems/ui";
import { useStagedRealEstateQuery } from "@/state";
import useAvailabilityFilterProps from "@/hooks/use-availability-filter-props";

type Props = {};

const AvailabilityFilterPopoverViewContainer = ({}: Props) => {
  const stagedQuery = useStagedRealEstateQuery();
  const { onChange } = useAvailabilityFilterProps();

  return (
    <AvailabilityFilterPopover
      value={stagedQuery.budgetAndAvailability.type}
      onChange={onChange}
    />
  );
};

export default AvailabilityFilterPopoverViewContainer;
