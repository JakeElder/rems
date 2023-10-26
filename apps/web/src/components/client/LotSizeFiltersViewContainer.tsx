"use client";

import React, { useCallback } from "react";
import { LotSizeFilters } from "@rems/ui";
import { MAX_LOT_SIZES, MIN_LOT_SIZES } from "../../constants";
import {
  commitRealEstateQuery,
  setSpace,
  useDispatch,
  useStagedRealEstateQuery
} from "@/state";

type ViewProps = React.ComponentProps<typeof LotSizeFilters>;
type Props = {};

const LotSizeFiltersViewContainer = ({}: Props) => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  const onMinLotSizeChange: ViewProps["onMinLotSizeChange"] = useCallback(
    (minLotSize) => {
      dispatch(setSpace({ role: "USER", data: { minLotSize } }));
      dispatch(commitRealEstateQuery());
    },
    []
  );

  const onMaxLotSizeChange: ViewProps["onMaxLotSizeChange"] = useCallback(
    (maxLotSize) => {
      dispatch(setSpace({ role: "USER", data: { maxLotSize } }));
      dispatch(commitRealEstateQuery());
    },
    []
  );

  return (
    <LotSizeFilters
      minLotSize={stagedQuery.space.minLotSize}
      maxLotSize={stagedQuery.space.maxLotSize}
      minLotSizes={MIN_LOT_SIZES}
      maxLotSizes={MAX_LOT_SIZES}
      onMinLotSizeChange={onMinLotSizeChange}
      onMaxLotSizeChange={onMaxLotSizeChange}
    />
  );
};

export default LotSizeFiltersViewContainer;
