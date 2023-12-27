"use client";

import React, { useCallback } from "react";
import { Pagination } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import { useDispatch, useStagedRealEstateQuery } from "@/state";
import { generateQueryString } from "@rems/utils/query";
import { commitRealEstateQuery, setPageAndSort } from "@rems/state/app/actions";

type ViewProps = React.ComponentProps<typeof Pagination>;
type Props = {};

const PaginationViewContainer = ({}: Props) => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();
  const { data, isLoading } = useProperties({ target: "LISTINGS" });

  const onChange: ViewProps["onPageChange"] = useCallback((page) => {
    dispatch(setPageAndSort({ role: "USER", data: { page } }));
    dispatch(commitRealEstateQuery());
  }, []);

  return (
    <Pagination
      loading={isLoading}
      onPageChange={onChange}
      currentPage={stagedQuery["pageAndSort"]["page"]}
      createLink={(page) => {
        return `/${generateQueryString(stagedQuery, { page })}`;
      }}
      total={data?.pagination.total}
      pageSize={data?.pagination.pageSize}
    />
  );
};

export default PaginationViewContainer;
