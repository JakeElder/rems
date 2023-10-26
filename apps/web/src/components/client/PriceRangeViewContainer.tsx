"use client";

import React from "react";
import { PriceRange } from "@rems/ui";
import usePriceRangeProps from "@/hooks/use-price-range-props";

type Props = {};

const PriceRangeViewContainer = ({}: Props) => {
  return <PriceRange {...usePriceRangeProps()} />;
};

export default PriceRangeViewContainer;
