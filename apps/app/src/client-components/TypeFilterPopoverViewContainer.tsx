"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { TypeFilterPopover } from "@rems/ui";

type Props = {
  types: React.ComponentProps<typeof TypeFilterPopover>["types"];
};

const TypeFilterPopoverViewContainer = ({ types }: Props) => {
  const { has, onCheckedChange, query } = useRealEstateQuery();
  return (
    <TypeFilterPopover
      types={types}
      on={has("view-types")}
      onChange={(value, checked) =>
        onCheckedChange("view-types", value, checked)
      }
      isChecked={(value) => query["view-types"].includes(value)}
    />
  );
};

export default TypeFilterPopoverViewContainer;
