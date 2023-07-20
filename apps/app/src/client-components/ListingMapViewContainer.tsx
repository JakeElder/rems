"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { ListingMap } from "@rems/ui";
import useSWR from "swr";
import getProperties from "../utils/get-properties";

type Props = {};

const ListingMapViewContainer = ({}: Props) => {
  const { queryString } = useRealEstateQuery();
  const key = queryString || "?";
  const { data } = useSWR(key, getProperties, {
    keepPreviousData: true
  });

  return <ListingMap properties={data?.data || []} />;
};

export default ListingMapViewContainer;
