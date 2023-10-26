"use client";

import React from "react";
import { ViewTypeFilters } from "@rems/ui";
import useFilterArrayProps from "@/hooks/use-filter-array-props";
import { useActiveViewTypeFilters } from "@/state";

type Props = Pick<React.ComponentProps<typeof ViewTypeFilters>, "types">;

const ViewTypeFiltersViewContainer = ({ types }: Props) => {
  const filters = useActiveViewTypeFilters();
  const { isChecked, onChange } = useFilterArrayProps("viewTypes", filters);

  return (
    <ViewTypeFilters types={types} onChange={onChange} isChecked={isChecked} />
  );
};

export default ViewTypeFiltersViewContainer;
