"use client";

import React from "react";
import { SearchRadius } from "@rems/ui";

type Props = {};

const SearchRadiusViewContainer = ({}: Props) => {
  return (
    <SearchRadius
      min={300}
      max={10_000}
      value={10000}
      onValueChange={() => {}}
      onValueCommit={() => {}}
      enabled={false}
      onEnabledChange={() => {}}
    />
  );
};

export default SearchRadiusViewContainer;
