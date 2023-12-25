"use client";

import React, { useEffect, useRef } from "react";
import { ListingMap } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import type { MapRef } from "react-map-gl";

type Props = {};

const ListingMapViewContainer = ({}: Props) => {
  const $map = useRef<MapRef>(null);
  const properties = useProperties({ target: "MAP" });

  useEffect(() => {
    if (!properties.data || !$map.current) {
      return;
    }
    const { bounds } = properties.data.location.resolution;
    $map.current.fitBounds([bounds.sw, bounds.ne]);
    // const camera = $map.current.cameraForBounds([bounds.sw, bounds.ne]);
  }, [properties.data?.location]);

  if (!properties.data) {
    return null;
  }

  return (
    <ListingMap
      ref={$map}
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
