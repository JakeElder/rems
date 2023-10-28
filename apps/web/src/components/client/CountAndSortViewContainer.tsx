"use client";

import React, { useCallback } from "react";
import { CountAndSort } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import {
  commitRealEstateQuery,
  setPageAndSort,
  useDispatch,
  useStagedRealEstateQuery
} from "@/state";

type ViewProps = React.ComponentProps<typeof CountAndSort>;
type Props = {};

const CountAndSortViewContainer = ({}: Props) => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();
  const { data, isLoading } = useProperties({ target: "LISTINGS" });

  const onChange: ViewProps["onChange"] = useCallback((sort) => {
    dispatch(setPageAndSort({ role: "USER", data: { sort } }));
    dispatch(commitRealEstateQuery());
  }, []);

  return (
    <CountAndSort
      loading={isLoading}
      sort={stagedQuery["pageAndSort"]["sort"]}
      listings={data?.pagination.total}
      onChange={onChange}
    />
  );
};

export default CountAndSortViewContainer;
