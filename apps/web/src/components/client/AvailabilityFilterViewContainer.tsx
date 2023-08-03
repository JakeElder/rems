"use client";

import React from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { AvailabilityFilter } from "@rems/ui";

type Props = {};

const AvailabilityFilterViewContainer = ({}: Props) => {
  const { query, onAvailabilityChange } = useRealEstateQuery();
  return (
    <AvailabilityFilter
      value={query["availability"]}
      onChange={onAvailabilityChange}
    />
  );
};

export default AvailabilityFilterViewContainer;
