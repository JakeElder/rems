import { RealEstateQuery } from "@rems/types";
import React from "react";
import api from "../../api";
import { CountAndSort as CountAndSortView } from "@rems/ui";

type Props = {
  query: RealEstateQuery;
};

async function ListingMap({ query }: Props) {
  const { data: properties } = await api.get.properties(query);
  return <CountAndSortView count={properties.length} />;
}

export default ListingMap;
