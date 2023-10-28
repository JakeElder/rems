"use client";

import React from "react";
import { PropertyCard, PropertyGrid } from "@rems/ui";
import useProperties from "@/hooks/use-properties";

type Props = {};

const PropertyGridViewContainer = ({}: Props) => {
  const { data, isLoading } = useProperties({ target: "LISTINGS" });

  return (
    <PropertyGrid loading={isLoading}>
      {(data?.data || []).map((p) => (
        <PropertyCard
          key={p.id}
          type={data!.query.budgetAndAvailability.type}
          property={p}
        />
      ))}
    </PropertyGrid>
  );
};

export default PropertyGridViewContainer;
