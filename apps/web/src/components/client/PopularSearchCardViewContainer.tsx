"use client";

import React from "react";
import { EntryCardGrid } from "@rems/ui";
import {
  EntryCard,
  FilterSet,
  PartialRealEstateQuery,
  PartialServerRealEstateQuery
} from "@rems/types";
import useProperties from "@/hooks/use-properties";
import { ServerRealEstateQuerySchema } from "@rems/schemas";
import { generateQueryString } from "@/hooks/use-real-estate-query";
import { PartialServerRealEstateQuerySchema } from "@rems/schemas/src/real-estate-query";

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
      "lot-features": ["new-built"],
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
  const qs = generateQueryString(query);

  const { data, isLoading } = useProperties(
    ServerRealEstateQuerySchema.parse(query)
  );

  const card: EntryCard = {
    loading: isLoading,
    id: filterSet.slug,
    title: filterSet.name,
    url: `/real-estate${qs}`,
    caption: data && `${data.pagination.total} listings`,
    image: filterSet.image
  };

  return <EntryCardGrid.Item card={card} />;
};

export default PopularSearchCardViewContainer;
