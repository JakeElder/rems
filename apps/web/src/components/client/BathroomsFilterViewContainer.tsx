"use client";

import React from "react";
import { BathroomsFilter } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";

type Props = {};

const BathroomsFilterViewContainer = ({}: Props) => {
  const { stagedQuery, onMinBathsChange } = useRealEstateQuery();
  return (
    <BathroomsFilter
      onChange={onMinBathsChange}
      value={stagedQuery["min-bathrooms"]}
    />
  );
};

export default BathroomsFilterViewContainer;
