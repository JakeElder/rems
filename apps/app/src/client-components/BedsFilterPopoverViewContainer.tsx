"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { BedsFilterPopover } from "@rems/ui";
import useBedsFilterProps from "../hooks/use-beds-filter-props";

type Props = {};

const BedsFilterPopoverViewContainer = ({}: Props) => {
  const { has } = useRealEstateQuery();
  const props = useBedsFilterProps();
  return (
    <BedsFilterPopover
      on={has("min-bedrooms") || has("max-bedrooms")}
      {...props}
    />
  );
};

export default BedsFilterPopoverViewContainer;
