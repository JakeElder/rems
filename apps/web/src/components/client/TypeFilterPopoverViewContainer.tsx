"use client";

import React from "react";
import { TypeFilterPopover } from "@rems/ui";
import useTypeFilterProps from "@/hooks/use-type-filter-props";
import { useHasPropertyTypesFilter } from "@/state";

type Props = {
  types: React.ComponentProps<typeof TypeFilterPopover>["types"];
};

const TypeFilterPopoverViewContainer = ({ types }: Props) => {
  const props = useTypeFilterProps();
  const on = useHasPropertyTypesFilter();
  return <TypeFilterPopover on={on} types={types} {...props} />;
};

export default TypeFilterPopoverViewContainer;
