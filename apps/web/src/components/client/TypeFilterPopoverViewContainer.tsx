"use client";

import React from "react";
import { TypeFilterPopover } from "@rems/ui";
import { useActivePropertyTypeFilters } from "@/state";
import useFilterArrayProps from "@/hooks/use-filter-array-props";

type Props = {
  types: React.ComponentProps<typeof TypeFilterPopover>["types"];
};

const TypeFilterPopoverViewContainer = ({ types }: Props) => {
  const filters = useActivePropertyTypeFilters();
  const props = useFilterArrayProps("propertyTypes", filters);
  return <TypeFilterPopover on={filters.length > 0} types={types} {...props} />;
};

export default TypeFilterPopoverViewContainer;
