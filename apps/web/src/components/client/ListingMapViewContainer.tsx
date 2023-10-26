"use client";

import React, { useEffect, useRef } from "react";
import { ListingMap } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import type { MapRef } from "react-map-gl";
import usePrevious from "use-previous";
import { useDebouncedCallback } from "use-debounce";
import { useRealEstateQuery } from "@/state";

type Props = {};

const ListingMapViewContainer = ({}: Props) => {
  const $map = useRef<MapRef>();
  const properties = useProperties();

  if (!properties.ready) {
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
