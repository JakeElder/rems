"use client";

import React from "react";
import { TypeFilterPopover } from "@rems/ui";
import useTypeFilterProps from "@/hooks/use-type-filter-props";

type Props = {
  types: React.ComponentProps<typeof TypeFilterPopover>["types"];
};

const TypeFilterPopoverViewContainer = ({ types }: Props) => {
  const props = useTypeFilterProps();
  return <TypeFilterPopover on={true} types={types} {...props} />;
};

export default TypeFilterPopoverViewContainer;
