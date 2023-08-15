// @ts-nocheck

"use client";

import React from "react";
import { AreaFilter } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";

type Props = Pick<React.ComponentProps<typeof AreaFilter>, "areas">;

const AreaFilterViewContainer = ({ areas }: Props) => {
  const { onValueChange, query } = useRealEstateQuery();
  return (
    <AreaFilter
      areas={areas}
      onChange={(value) => onValueChange("area", value)}
      value={query["area"]}
    />
  );
};

export default AreaFilterViewContainer;
