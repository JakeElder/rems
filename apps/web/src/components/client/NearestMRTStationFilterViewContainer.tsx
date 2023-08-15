// @ts-nocheck

"use client";

import React from "react";
import { NearestMRTStationFilter } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";

type Props = Pick<
  React.ComponentProps<typeof NearestMRTStationFilter>,
  "stations"
>;

const NearestMRTStationFilterViewContainer = ({ stations }: Props) => {
  const { onValueChange, query } = useRealEstateQuery();

  return (
    <NearestMRTStationFilter
      stations={stations}
      value={query["nearest-mrt-station"]}
      onChange={(value) => onValueChange("nearest-mrt-station", value)}
    />
  );
};

export default NearestMRTStationFilterViewContainer;
