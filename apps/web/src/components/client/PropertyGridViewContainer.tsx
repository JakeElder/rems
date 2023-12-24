"use client";

import React, { useCallback } from "react";
import { PropertyRow, PropertyRowContainer } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import {
  useAssistantSelectedProperty,
  useDispatch,
  useUserSelectedProperty
} from "@/state";
import {
  registerSelectedProperty,
  setSelectedProperty
} from "@rems/state/app/actions";
import fetch from "@/fetch";
import { Property } from "@rems/types";

type Props = {};

const PropertyGridViewContainer = ({}: Props) => {
  const { data, isLoading } = useProperties({ target: "LISTINGS" });
  const dispatch = useDispatch();
  const userSelectedPropertyId = useUserSelectedProperty();
  const assistantSelectedPropertyId = useAssistantSelectedProperty();

  const getSelection = useCallback(
    (id: Property["id"]) => {
      if (userSelectedPropertyId === id) return "USER";
      if (assistantSelectedPropertyId === id) return "ASSISTANT";
      return null;
    },
    [userSelectedPropertyId, assistantSelectedPropertyId]
  );

  return (
    <PropertyRowContainer loading={isLoading}>
      {(data?.data || []).map((p) => (
        <PropertyRow
          key={p.id}
          type={data!.query.budgetAndAvailability.type}
          property={p}
          selection={getSelection(p.id)}
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
              setSelectedProperty({
                role: "USER",
                id: userSelectedPropertyId === p.id ? null : p.id
              })
            );
          }}
        />
      ))}
    </PropertyRowContainer>
  );
};

export default PropertyGridViewContainer;
