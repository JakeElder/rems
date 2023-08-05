"use client";

import React from "react";
import { PropertyCard, PropertyGrid } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import useRealEstateQuery from "@/hooks/use-real-estate-query";

type Props = {};

const PropertyGridViewContainer = ({}: Props) => {
  const { serverQuery } = useRealEstateQuery();
  const { data, isLoading } = useProperties(serverQuery);

  return (
    <PropertyGrid loading={isLoading}>
      {(data?.data || []).map((p) => (
        <PropertyCard key={p.id} type={data!.query.availability} property={p} />
      ))}
    </PropertyGrid>
  );
};

export default PropertyGridViewContainer;
