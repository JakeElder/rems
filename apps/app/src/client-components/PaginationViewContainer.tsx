"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { Pagination } from "@rems/ui";
import useSWR from "swr";
import getProperties from "../utils/get-properties";

type Props = {};

const PaginationViewContainer = ({}: Props) => {
  const { query, queryString, onPageChange, createLink } = useRealEstateQuery();
  const key = queryString || "?";
  const { data, isLoading } = useSWR(key, getProperties, {
    keepPreviousData: true
  });

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
