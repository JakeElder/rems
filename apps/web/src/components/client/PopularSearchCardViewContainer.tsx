"use client";

import React from "react";
import { FilterSet, PartialServerRealEstateQuery } from "@rems/types";
import EntryCardViewContainer from "./EntryCardViewContainer";

type Props = {
  filterSet: FilterSet;
};

const resolveQuery: (slug: string) => PartialServerRealEstateQuery = (slug) => {
  const sets: Record<string, PartialServerRealEstateQuery> = {
    "cozy-pads-for-young-professionals": {
      "indoor-features": ["cozy"],
      availability: "rent"
    },
    "family-friendly-houses-with-gardens": {
      "outdoor-features": ["garden"],
      "lot-features": ["family-friendly"]
    },
    "new-builds-ready-to-move-in-to-in-bangkok": {
      "lot-features": ["new-built"]
    },
    "pool-villas-for-sale-in-bangkok": {
      "property-type": ["villa"],
      "outdoor-features": ["pool"]
    }
  };

  return sets[slug];
};

const PopularSearchCardViewContainer = ({ filterSet }: Props) => {
  const query = resolveQuery(filterSet.slug);

  if (!query) {
    return null;
  }

  return <EntryCardViewContainer query={query} filterSet={filterSet} />;
};

export default PopularSearchCardViewContainer;
