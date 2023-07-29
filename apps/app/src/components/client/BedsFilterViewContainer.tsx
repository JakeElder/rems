"use client";

import React from "react";
import { BedsFilter } from "@rems/ui";
import useBedsFilterProps from "@/hooks/use-beds-filter-props";

type Props = {};

const BedsFilterViewContainer = ({}: Props) => {
  return <BedsFilter {...useBedsFilterProps()} />;
};

export default BedsFilterViewContainer;
