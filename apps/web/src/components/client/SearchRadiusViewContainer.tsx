"use client";

import React from "react";
import { SearchRadius } from "@rems/ui";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import useRealEstateIndexPageState from "@/hooks/use-real-estate-index-page-state";
import { observer } from "@legendapp/state/react";

type Props = {};

const SearchRadiusViewContainer = ({}: Props) => {
  const { stagedQuery, onSearchRadiusChange, onSearchRadiusEnabledChange } =
    useRealEstateQuery();

  return (
    <SearchRadius
      min={300}
      max={10_000}
      value={10000}
      onValueChange={([value]) => {
        // radius.set(value)
      }}
      onValueCommit={([value]) => onSearchRadiusChange(value)}
      enabled={stagedQuery["radius-enabled"] === "true"}
      onEnabledChange={onSearchRadiusEnabledChange}
    />
  );
};

export default observer(SearchRadiusViewContainer);
