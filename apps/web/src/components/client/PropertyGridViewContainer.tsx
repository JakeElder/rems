"use client";

import React from "react";
import { PropertyRow, PropertyRowContainer } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import { useDispatch, useSelectedPropertyId } from "@/state";
import {
  registerSelectedProperty,
  setSelectedPropertyId
} from "@rems/state/app/actions";
import fetch from "@/fetch";

type Props = {};

const PropertyGridViewContainer = ({ }: Props) => {
  const { data, isLoading } = useProperties({ target: "LISTINGS" });
  const dispatch = useDispatch();
  const selectedPropertyId = useSelectedPropertyId();

  return (
    <PropertyRowContainer loading={isLoading}>
      {(data?.data || []).map((p) => (
        <PropertyRow
          key={p.id}
          type={data!.query.budgetAndAvailability.type}
          property={p}
          active={selectedPropertyId === p.id}
          onClick={(e) => {
            e.preventDefault();
            fetch("property", p.id).then((p) => {
              dispatch(
                registerSelectedProperty({
                  role: "USER",
                  property: p
                })
              );
            });
            dispatch(
              setSelectedPropertyId({
                role: "USER",
                id: selectedPropertyId === p.id ? null : p.id
              })
            );
          }}
        />
      ))}
    </PropertyRowContainer>
  );
};

export default PropertyGridViewContainer;
