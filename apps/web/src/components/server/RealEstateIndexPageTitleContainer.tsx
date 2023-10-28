import React from "react";
import { RealEstateIndexPage } from "@rems/ui";
import { SearchParams } from "@rems/types";
import { fromSearchParams } from "@rems/utils/query";
import fetch from "@/fetch";

type Props = {
  searchParams?: SearchParams;
};

const RealEstateIndexPageTitleContainer = async ({ searchParams }: Props) => {
  const filters = await fetch("array-filters");
  const query = fromSearchParams(searchParams || {}, filters);

  const res = await fetch("properties", { ...query, target: "LISTINGS" });
  const { source, resolution } = res.location;

  if (source.type === "NL") {
    return (
      <RealEstateIndexPage.Title
        geospatialOperator={source.geospatialOperator}
        location={source.description}
        type={res.query.budgetAndAvailability.type.toLowerCase()}
        resolution={resolution.displayName}
      />
    );
  }

  throw new Error("LL not implemented");
};

export default RealEstateIndexPageTitleContainer;
