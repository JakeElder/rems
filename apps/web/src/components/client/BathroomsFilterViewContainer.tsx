"use client";

import React from "react";
import { BathroomsFilter } from "@rems/ui";
import useBathsFilterProps from "@/hooks/use-baths-filter-props";

type Props = {};

const BathroomsFilterViewContainer = ({}: Props) => {
  return <BathroomsFilter {...useBathsFilterProps()} />;
};

export default BathroomsFilterViewContainer;
