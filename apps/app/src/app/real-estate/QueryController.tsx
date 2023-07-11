import React from "react";
import { RealEstateQuery } from "@rems/types";
import { RealEstateQueryController } from "@rems/ui";
import api from "../../api";

type Props = {
  query: RealEstateQuery;
  children: React.ReactNode;
};

async function QueryController({ query, children }: Props) {
  async function get(query: RealEstateQuery) {
    "use server";
    return api.get.properties(query);
  }

  return (
    <RealEstateQueryController query={query} children={children} get={get} />
  );
}

export default QueryController;
