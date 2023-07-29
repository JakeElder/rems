"use client";

import React from "react";
import { TypeFilters } from "@rems/ui";
import useTypeFilterProps from "@/hooks/use-type-filter-props";

type Props = Pick<React.ComponentProps<typeof TypeFilters>, "id" | "types">;

const TypeFiltersViewContainer = ({ id, types }: Props) => {
  const props = useTypeFilterProps();
  return <TypeFilters id={id} types={types} {...props} />;
};

export default TypeFiltersViewContainer;
