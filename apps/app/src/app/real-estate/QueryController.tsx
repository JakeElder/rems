import { RealEstateQuery } from "@rems/types";
import { RealEstateQueryController } from "@rems/ui";
import React from "react";
import api from "../../api";

type Props = {
  query: RealEstateQuery;
  children: React.ReactNode;
};

async function QueryController({ query, children }: Props) {
  const result = await api.get.properties(query);
  return (
    <RealEstateQueryController
      query={query}
      result={result}
      children={children}
    />
  );
}

export default QueryController;
