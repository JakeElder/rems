import fetch from "@/fetch";
import React from "react";
import { EntryCardGrid } from "@rems/ui";
import PopularSearchCardViewContainer from "../client/PopularSearchCardViewContainer";

type Props = {};

const PopularSearches = async ({}: Props) => {
  const filterSets = await fetch("popular-searches");
  return (
    <EntryCardGrid.Root>
      {filterSets.map((f) => (
        <PopularSearchCardViewContainer key={f.slug} filterSet={f} />
      ))}
    </EntryCardGrid.Root>
  );
};

export default PopularSearches;
