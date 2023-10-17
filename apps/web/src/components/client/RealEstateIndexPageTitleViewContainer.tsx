"use client";

import React from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { RealEstateIndexPage } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
// import useSWR from "swr";

type Props = {};

const RealEstateIndexPageTitleViewContainer = ({}: Props) => {
  const { serverQuery } = useRealEstateQuery();
  const properties = useProperties(serverQuery);

  // useEffect(() => {
  //   document.title = title;
  // }, [title]);

  if (!properties.ready) {
    return (
      <RealEstateIndexPage.Title
        geospatialOperator="in"
        location="Bangkok"
        type={serverQuery["availability"]}
      />
    );
  }

  const { source, resolution } = properties.data.location;

  if (source.type === "NL") {
    return (
      <RealEstateIndexPage.Title
        geospatialOperator={source.geospatialOperator}
        location={source.description}
        type={serverQuery["availability"]}
        resolution={resolution.displayName}
      />
    );
  }

  throw new Error("LL not implemented");
};

export default RealEstateIndexPageTitleViewContainer;
