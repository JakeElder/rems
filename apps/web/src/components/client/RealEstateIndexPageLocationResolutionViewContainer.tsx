"use client";

import React from "react";
import { RealEstateIndexPage as Layout } from "@rems/ui";
import { useShowDistance } from "@/state";
import { useDispatch } from "react-redux";
import { setShowDistance } from "@rems/state/app/actions";

type Props = Pick<
  React.ComponentProps<typeof Layout.LocationResolution>,
  "resolution" | "distanceAvailable"
>;

const RealEstateIndexPageLocationResolutionViewContainer = ({
  distanceAvailable,
  resolution
}: Props) => {
  const showDistance = useShowDistance();
  const dispatch = useDispatch();

  return (
    <Layout.LocationResolution
      resolution={resolution}
      distanceAvailable={distanceAvailable}
      showDistance={showDistance}
      onShowDistanceChange={(a) => {
        dispatch(
          setShowDistance({
            role: "USER",
            show: a === true
          })
        );
      }}
    />
  );
};

export default RealEstateIndexPageLocationResolutionViewContainer;
