"use client";

import React from "react";
import { PropertyRow, PropertyRowContainer } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import { useDispatch, useSelectedProperty } from "@/state";
import { setSelectedProperty } from "@rems/state/app/actions";

type Props = {};

const PropertyGridViewContainer = ({ }: Props) => {
  const { data, isLoading } = useProperties({ target: "LISTINGS" });
  const dispatch = useDispatch();
  const selectedProperty = useSelectedProperty();

  return (
    <PropertyRowContainer loading={isLoading}>
      {(data?.data || []).map((p) => (
        <PropertyRow
          key={p.id}
          type={data!.query.budgetAndAvailability.type}
          property={p}
          active={selectedProperty === p.id}
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setSelectedProperty({
                role: "USER",
                property: selectedProperty === p.id ? null : p.id
              })
            );
          }}
        />
      ))}
    </PropertyRowContainer>
  );
};

export default PropertyGridViewContainer;
