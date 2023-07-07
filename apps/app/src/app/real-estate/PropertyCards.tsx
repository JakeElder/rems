import { RealEstateQuery } from "@rems/types";
import { PropertyCard } from "@rems/ui";
import slugify from "@sindresorhus/slugify";
import React from "react";
import api from "../../api";

type Props = {
  query: RealEstateQuery;
};

async function PropertyCards({ query }: Props) {
  const { data } = await api.get.properties(query);
  return data.map((p) => (
    <PropertyCard
      key={p.id}
      property={p}
      link={`/real-estate/${slugify(p.title)}-${p.id}`}
    />
  ));
}

export default PropertyCards;
