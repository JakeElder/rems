"use client";

import React, { useEffect, useRef } from "react";
import { ListingMap } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import type { MapRef } from "react-map-gl";
import { useAssistantPlacement } from "@/state";

type Props = {};

const ListingMapViewContainer = ({}: Props) => {
  const $map = useRef<MapRef>(null);
  const properties = useProperties({ target: "MAP" });
  const placement = useAssistantPlacement();

  useEffect(() => {
    if (!properties.data || !$map.current) {
      return;
    }
    const { bounds } = properties.data.location.resolution;
    $map.current.fitBounds([bounds.sw, bounds.ne], {
      padding: {
        top: 0,
        left: 0,
        right: 0,
        bottom: placement === "DOCKED" ? 600 : 0
      }
    });
    // const camera = $map.current.cameraForBounds([bounds.sw, bounds.ne]);
  }, [properties.data?.location, placement]);

  if (!properties.data) {
    return null;
  }

  const { location } = properties.data;

  return (
    <ListingMap
      ref={$map}
      properties={properties.data.data}
      lat={location.resolution.lat}
      lng={location.resolution.lng}
      bounds={location.resolution.bounds}
      radius={location.source.radius}
      showRadius={location.resolution.type === "POINT"}
    />
  );
};

export default ListingMapViewContainer;
