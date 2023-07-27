"use client";

import React from "react";
import { Pagination } from "@rems/ui";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import useProperties from "../hooks/use-properties";

type Props = {};

const PaginationViewContainer = ({}: Props) => {
  const { query, onPageChange, createLink } = useRealEstateQuery();
  const { data, isLoading } = useProperties();

  return (
    <Pagination
      loading={isLoading}
      onPageChange={onPageChange}
      currentPage={query["page"]}
      createLink={createLink}
      total={data?.pagination.total}
      pageSize={data?.pagination.pageSize}
    />
  );
};

export default PaginationViewContainer;
