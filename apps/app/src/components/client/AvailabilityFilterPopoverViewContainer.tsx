"use client";

import React from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { AvailabilityFilterPopover } from "@rems/ui";

type Props = {};

const AvailabilityFilterPopoverViewContainer = ({}: Props) => {
  const { query, onAvailabilityChange } = useRealEstateQuery();
  return (
    <AvailabilityFilterPopover
      value={query["availability"]}
      onChange={onAvailabilityChange}
    />
  );
};

export default AvailabilityFilterPopoverViewContainer;
