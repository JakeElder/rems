"use client";

import React from "react";
import { PriceRange } from "@rems/ui";
import usePriceRangeProps from "@/hooks/use-price-range-props";

type Props = {};

const PriceRangeViewContainer = ({}: Props) => {
  const props = usePriceRangeProps();
  return <PriceRange {...props} />;
};

export default PriceRangeViewContainer;
