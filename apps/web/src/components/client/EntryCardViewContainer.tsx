"use client";

import React from "react";
import { EntryCardGrid } from "@rems/ui";
import {
  EntryCard,
  FilterSet,
  PartialServerRealEstateQuery
} from "@rems/types";
import useProperties from "@/hooks/use-properties";
import { ServerRealEstateQuerySchema } from "@rems/schemas";
import { generateQueryString } from "@/hooks/use-real-estate-query";

type Props = {
  query: PartialServerRealEstateQuery;
  filterSet: FilterSet;
};

const EntryCardViewContainer = ({ filterSet, query }: Props) => {
  const { data, isLoading } = useProperties(
    ServerRealEstateQuerySchema.parse(query)
  );

  const qs = generateQueryString(query);

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

export default EntryCardViewContainer;
