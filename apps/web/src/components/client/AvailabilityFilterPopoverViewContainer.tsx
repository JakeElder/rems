"use client";

import React from "react";
import { AvailabilityFilterPopover } from "@rems/ui";
import {
  commitRealEstateQuery,
  setBudgetAndAvailability,
  useDispatch,
  useStagedRealEstateQuery
} from "@/state";

type Props = {};

const AvailabilityFilterPopoverViewContainer = ({}: Props) => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  return (
    <AvailabilityFilterPopover
      value={stagedQuery.budgetAndAvailability.type}
      onChange={(type) => {
        dispatch(
          setBudgetAndAvailability({
            role: "USER",
            data: { type }
          })
        );
        dispatch(commitRealEstateQuery());
      }}
    />
  );
};

export default AvailabilityFilterPopoverViewContainer;
