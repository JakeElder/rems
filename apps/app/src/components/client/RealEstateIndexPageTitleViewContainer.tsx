"use client";

import React from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { RealEstateIndexPage } from "@rems/ui";
// import useSWR from "swr";
// import queryToNlTitle from "../utils/query-to-nl-title";

type Props = {};

const RealEstateIndexPageTitleViewContainer = ({}: Props) => {
  const { query } = useRealEstateQuery();
  // const { data } = useSWR(`title:${queryString}`, () => queryToNlTitle(query), {
  //   keepPreviousData: true
  // });

  return (
    <RealEstateIndexPage.Title>
      Houses for {query["availability"]} in Thailand
    </RealEstateIndexPage.Title>
  );
};

export default RealEstateIndexPageTitleViewContainer;
