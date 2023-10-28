"use client";

import React, { useRef } from "react";
import { ListingMap } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import type { MapRef } from "react-map-gl";

type Props = {};

const ListingMapViewContainer = ({}: Props) => {
  const $map = useRef<MapRef>();
  const properties = useProperties({ target: "MAP" });

  if (!properties.data) {
    return null;
  }

  return (
    <ListingMap
      ref={$map as any}
      properties={properties.data.data}
      lat={properties.data.location.resolution.lat}
      lng={properties.data.location.resolution.lng}
      bounds={properties.data.location.resolution.bounds}
      radius={10000}
      showRadius={false}
    />
  );
};

export default ListingMapViewContainer;
