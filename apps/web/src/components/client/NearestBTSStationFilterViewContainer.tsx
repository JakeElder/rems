// @ts-nocheck

"use client";

import React from "react";
import { NearestBTSStationFilter } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";

type Props = Pick<
  React.ComponentProps<typeof NearestBTSStationFilter>,
  "stations"
>;

const NearestBTSStationFilterViewContainer = ({ stations }: Props) => {
  const { onValueChange, query } = useRealEstateQuery();

  return (
    <NearestBTSStationFilter
      stations={stations}
      value={query["nearest-bts-station"]}
      onChange={(value) => onValueChange("nearest-bts-station", value)}
    />
  );
};

export default NearestBTSStationFilterViewContainer;
