import fetch from "@/fetch";
import React from "react";
import { EntryCardGrid } from "@rems/ui";
import { EntryCard, FilterSet } from "@rems/types";

type Props = {};

const filterSetToCard = async (f: FilterSet): Promise<EntryCard> => {
  return {
    title: f.name,
    url: "#",
    caption: "xx listings",
    image: f.image
  };
};

const PopularSearches = async ({}: Props) => {
  const filterSets = await fetch("popular-searches");
  const cards = await Promise.all(filterSets.map(filterSetToCard));
  return <EntryCardGrid cards={cards} />;
};

export default PopularSearches;
