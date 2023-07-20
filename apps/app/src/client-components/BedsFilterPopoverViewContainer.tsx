"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { BedsFilterPopover } from "@rems/ui";

type Props = {};

const BedsFilterPopoverViewContainer = ({}: Props) => {
  const { has, query, onMinBedsChange, onMaxBedsChange } = useRealEstateQuery();
  return (
    <BedsFilterPopover
      on={has("min-bedrooms") || has("max-bedrooms")}
      maxBedrooms={query["max-bedrooms"]}
      minBedrooms={query["min-bedrooms"]}
      onMinChange={onMinBedsChange}
      onMaxChange={onMaxBedsChange}
    />
  );
};

export default BedsFilterPopoverViewContainer;
