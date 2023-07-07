import { RealEstateQuery } from "@rems/types";
import { RealEstateQueryController } from "@rems/ui";
import React from "react";
import api from "../../api";

type Props = {
  query: RealEstateQuery;
  children: React.ReactNode;
};

async function QueryController({ query, children }: Props) {
  const { pagination } = await api.get.properties(query);
  return (
    <RealEstateQueryController
      query={query}
      count={pagination.total}
      children={children}
    />
  );
}

export default QueryController;
