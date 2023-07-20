"use client";

import React from "react";
import { ViewTypeFilters } from "@rems/ui";
import useRealEstateQuery from "../hooks/use-real-estate-query";

type Props = Pick<React.ComponentProps<typeof ViewTypeFilters>, "types">;

const ViewTypeFiltersViewContainer = ({ types }: Props) => {
  const { onCheckedChange, query } = useRealEstateQuery();

  return (
    <ViewTypeFilters
      types={types}
      onChange={(value, checked) =>
        onCheckedChange("view-types", value, checked)
      }
      isChecked={(value) => query["view-types"].includes(value)}
    />
  );
};

export default ViewTypeFiltersViewContainer;
