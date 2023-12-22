"use client";

import React from "react";
import { PropertyRow, PropertyRowContainer } from "@rems/ui";
import useProperties from "@/hooks/use-properties";

type Props = {};

const PropertyGridViewContainer = ({ }: Props) => {
  const { data, isLoading } = useProperties({ target: "LISTINGS" });

  return (
    <PropertyRowContainer loading={isLoading}>
      {(data?.data || []).map((p) => (
        <PropertyRow
          key={p.id}
          type={data!.query.budgetAndAvailability.type}
          property={p}
          active={false}
        />
      ))}
    </PropertyRowContainer>
  );
};

export default PropertyGridViewContainer;
