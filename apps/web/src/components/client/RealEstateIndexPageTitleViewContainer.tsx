"use client";

import React, { useEffect } from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { RealEstateIndexPage } from "@rems/ui";
// import useSWR from "swr";

type Props = {};

const RealEstateIndexPageTitleViewContainer = ({}: Props) => {
  const { query } = useRealEstateQuery();
  const title = `Homes for ${query["availability"]} in Thailand`;

  useEffect(() => {
    document.title = title;
  }, [title]);

  // const { data } = useSWR(
  //   `title:${queryString}`,
  //   () => fetch(`/api/titles?${queryString}`),
  //   { keepPreviousData: true }
  // );

  return <RealEstateIndexPage.Title>{title}</RealEstateIndexPage.Title>;
};

export default RealEstateIndexPageTitleViewContainer;
