"use client";

import React from "react";
import { BathroomsFilter } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";

type Props = {};

const BathroomsFilterViewContainer = ({}: Props) => {
  const { query, onMinBathsChange } = useRealEstateQuery();
  return (
    <BathroomsFilter
      onChange={onMinBathsChange}
      value={query["min-bathrooms"]}
    />
  );
};

export default BathroomsFilterViewContainer;
