"use client";

import React from "react";
import { FilterSet } from "@rems/types";
import EntryCardViewContainer from "./EntryCardViewContainer";

type Props = {
  filterSet: FilterSet;
};

const PopularSearchCardViewContainer = ({ filterSet }: Props) => {
  return <EntryCardViewContainer filterSet={filterSet} />;
};

export default PopularSearchCardViewContainer;
