"use client";

import React from "react";
import { IndoorFeatureFilters } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";

type Props = Pick<
  React.ComponentProps<typeof IndoorFeatureFilters>,
  "features"
>;

const IndoorFeatureFiltersViewContainer = ({ features }: Props) => {
  const { onCheckedChange, query } = useRealEstateQuery();

  return (
    <IndoorFeatureFilters
      features={features}
      onChange={(value, checked) =>
        onCheckedChange("indoor-features", value, checked)
      }
      isChecked={(value) => query["indoor-features"].includes(value)}
    />
  );
};

export default IndoorFeatureFiltersViewContainer;
