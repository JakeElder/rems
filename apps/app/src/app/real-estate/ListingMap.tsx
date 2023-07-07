import { RealEstateQuery } from "@rems/types";
import React from "react";
import api from "../../api";
import { ListingMap as ListingMapView } from "@rems/ui";

type Props = {
  query: RealEstateQuery;
};

async function ListingMap({ query }: Props) {
  const { data: properties } = await api.get.properties(query);
  return <ListingMapView properties={properties} />;
}

export default ListingMap;
