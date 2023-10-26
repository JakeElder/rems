"use client";

import React from "react";
import { PriceFilterPopover } from "@rems/ui";
import usePriceRangeProps from "@/hooks/use-price-range-props";
import { useHasPriceFilter } from "@/state";

type Props = {};

const PriceFilterPopoverViewContainer = ({}: Props) => {
  const props = usePriceRangeProps();
  const on = useHasPriceFilter();
  return <PriceFilterPopover on={on} {...props} />;
};

export default PriceFilterPopoverViewContainer;
