"use client";

import { Provider } from "react-redux";
import { store, replaceRealEstateQuery } from "@/state";
import { RealEstateQuery } from "@rems/types";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  query: RealEstateQuery;
};

const StateProviderViewContainer = ({ children, query }: Props) => {
  const $initialised = useRef(false);

  if (!$initialised.current) {
    store.dispatch(replaceRealEstateQuery(query));
    $initialised.current = true;
  }

  return <Provider store={store}>{children}</Provider>;
};

export default StateProviderViewContainer;
