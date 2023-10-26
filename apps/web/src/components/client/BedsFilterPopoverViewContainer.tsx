"use client";

import React from "react";
import { BedsFilterPopover } from "@rems/ui";
import useBedsFilterProps from "@/hooks/use-beds-filter-props";
import { useHasBedsFilter } from "@/state";

type Props = {};

const BedsFilterPopoverViewContainer = ({}: Props) => {
  const props = useBedsFilterProps();
  const on = useHasBedsFilter();
  return <BedsFilterPopover {...props} on={on} />;
};

export default BedsFilterPopoverViewContainer;
