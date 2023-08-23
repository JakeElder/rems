"use client";

import React from "react";
import { LotFeatureFilters } from "@rems/ui";
import useRealEstateQuery from "../../hooks/use-real-estate-query";

type Props = Pick<React.ComponentProps<typeof LotFeatureFilters>, "features">;

const LotFeatureFiltersViewContainer = ({ features }: Props) => {
  const { onCheckedChange, stagedQuery } = useRealEstateQuery();

  return (
    <LotFeatureFilters
      features={features}
      onChange={(value, checked) =>
        onCheckedChange("lot-features", value, checked)
      }
      isChecked={(value) => stagedQuery["lot-features"].includes(value)}
    />
  );
};

export default LotFeatureFiltersViewContainer;
