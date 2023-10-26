"use client";

import React from "react";
import { TypeFilters } from "@rems/ui";
import useFilterArrayProps from "@/hooks/use-filter-array-props";
import { useActivePropertyTypeFilters } from "@/state";

type Props = Pick<React.ComponentProps<typeof TypeFilters>, "id" | "types">;

const TypeFiltersViewContainer = ({ id, types }: Props) => {
  const filters = useActivePropertyTypeFilters();
  const props = useFilterArrayProps("propertyTypes", filters);
  return <TypeFilters id={id} types={types} {...props} />;
};

export default TypeFiltersViewContainer;
