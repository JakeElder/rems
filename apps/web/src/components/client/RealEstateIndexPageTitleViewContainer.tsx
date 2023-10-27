"use client";

import React from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { RealEstateIndexPage } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
// import useSWR from "swr";

type Props = {};

const RealEstateIndexPageTitleViewContainer = ({}: Props) => {
  const properties = useProperties();

  if (!properties.ready) {
    return (
      <RealEstateIndexPage.Title
        geospatialOperator="in"
        location="Bangkok"
        type="sale"
      />
    );
  }

  const { source, resolution } = properties.data.location;

  if (source.type === "NL") {
    return (
      <RealEstateIndexPage.Title
        geospatialOperator={source.geospatialOperator}
        location={source.description}
        type={properties.data.query.budgetAndAvailability.type.toLowerCase()}
        resolution={resolution.displayName}
      />
    );
  }

  throw new Error("LL not implemented");
};

export default RealEstateIndexPageTitleViewContainer;
