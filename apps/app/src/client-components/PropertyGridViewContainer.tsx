"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { PropertyCard, PropertyGrid } from "@rems/ui";
import useSWR from "swr";
import getProperties from "../utils/get-properties";

type Props = {};

const PropertyGridViewContainer = ({}: Props) => {
  const { queryString } = useRealEstateQuery();
  const key = queryString || "?";
  const { data, isLoading } = useSWR(key, getProperties, {
    keepPreviousData: true
  });

  return (
    <PropertyGrid loading={isLoading}>
      {(data?.data || []).map((p) => (
        <PropertyCard key={p.id} type="sale" property={p} />
      ))}
    </PropertyGrid>
  );
};

export default PropertyGridViewContainer;
