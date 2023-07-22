"use client";

import React, { useCallback, useState } from "react";
import { AiSearch } from "@rems/ui";
import { debounce } from "throttle-debounce";
import { nlToQuery } from "../app/actions";
import useRealEstateQuery from "../hooks/use-real-estate-query";

type Props = {};

const AiSearchViewContainer = ({}: Props) => {
  const [value, setValue] = useState("");
  const { commit } = useRealEstateQuery();

  const search = async (nl: string) => {
    if (nl.length > 10) {
      const query = await nlToQuery(nl);
      commit(query);
    } else if (!nl.length) {
      commit({});
    }
  };

  const debouncedUpdate = useCallback(
    debounce(1000, search, { atBegin: false }),
    []
  );

  return (
    <AiSearch
      value={value}
      onChange={(e) => {
        setValue(e.currentTarget.value);
        debouncedUpdate(e.currentTarget.value);
      }}
    />
  );
};

export default AiSearchViewContainer;
