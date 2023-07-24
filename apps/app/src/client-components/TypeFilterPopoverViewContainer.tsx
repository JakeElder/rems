"use client";

import React from "react";
import { TypeFilterPopover } from "@rems/ui";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import useTypeFilterProps from "../hooks/use-type-filter-props";

type Props = {
  types: React.ComponentProps<typeof TypeFilterPopover>["types"];
};

const TypeFilterPopoverViewContainer = ({ types }: Props) => {
  const { has } = useRealEstateQuery();
  const props = useTypeFilterProps();
  return (
    <TypeFilterPopover on={has("property-type")} types={types} {...props} />
  );
};

export default TypeFilterPopoverViewContainer;
