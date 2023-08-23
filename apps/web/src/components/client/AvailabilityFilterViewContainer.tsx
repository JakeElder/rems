"use client";

import React from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { AvailabilityFilter } from "@rems/ui";

type Props = {};

const AvailabilityFilterViewContainer = ({}: Props) => {
  const { stagedQuery, onAvailabilityChange } = useRealEstateQuery();
  return (
    <AvailabilityFilter
      value={stagedQuery["availability"]}
      onChange={onAvailabilityChange}
    />
  );
};

export default AvailabilityFilterViewContainer;
