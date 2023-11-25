"use client";

import { Provider } from "react-redux";
import { store } from "@/state";
import { RealEstateQuery } from "@rems/types";
import { useRef } from "react";
import { replaceRealEstateQuery } from "@rems/state/app/actions";

type Props = {
  children: React.ReactNode;
  query: RealEstateQuery;
};

const StateProvider = ({ children, query }: Props) => {
  const $initialised = useRef(false);

  if (!$initialised.current) {
    store.dispatch(replaceRealEstateQuery(query));
    $initialised.current = true;
  }

  return <Provider store={store}>{children}</Provider>;
};

export default StateProvider;
