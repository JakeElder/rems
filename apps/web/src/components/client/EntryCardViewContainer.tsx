"use client";

import React from "react";
import { EntryCardGrid } from "@rems/ui";
import { EntryCard, FilterSet } from "@rems/types";
import useFilterSet from "@/hooks/use-filter-set";

type Props = {
  filterSet: FilterSet;
};

const EntryCardViewContainer = ({ filterSet }: Props) => {
  const set = useFilterSet(filterSet);

  const card: EntryCard = {
    loading: set.isLoading,
    id: filterSet.slug,
    title: filterSet.name,
    url: set.url,
    caption: set.data && `${set.data.pagination.total} listings`,
    image: filterSet.image
  };

  return <EntryCardGrid.Item card={card} />;
};

export default EntryCardViewContainer;
