"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { PriceFilterPopover } from "@rems/ui";
import usePriceRangeProps from "../hooks/use-price-range-props";

type Props = {};

const PriceFilterPopoverViewContainer = ({}: Props) => {
  const { has } = useRealEstateQuery();
  const props = usePriceRangeProps();
  return (
    <PriceFilterPopover on={has("min-price") || has("max-price")} {...props} />
  );
};

export default PriceFilterPopoverViewContainer;
