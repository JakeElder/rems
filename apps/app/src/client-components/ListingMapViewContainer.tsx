"use client";

import React, { useEffect, useRef } from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { ListingMap } from "@rems/ui";
import useProperties from "../hooks/use-properties";
import type { MapRef } from "react-map-gl";
import usePrevious from "use-previous";
import dynamic from "next/dynamic";

type Props = {};

const ListingMapViewContainer = ({}: Props) => {
  const mapRef = useRef<MapRef | undefined>();
  const { query, onMapZoomChange, onMapMove, isReady } = useRealEstateQuery();
  const previousQuery = usePrevious(query);
  const { data } = useProperties();

  useEffect(() => {
    if (!isReady || !previousQuery || !mapRef.current) {
      return;
    }
    mapRef.current.panTo([
      query["search-origin-lng"],
      query["search-origin-lat"]
    ]);
  }, [query["search-origin-lat"], query["search-origin-lng"]]);

  useEffect(() => {
    if (!isReady || !previousQuery || !mapRef.current) {
      return;
    }
    mapRef.current.zoomTo(query["map-zoom"]);
  }, [query["map-zoom"]]);

  if (!isReady) {
    return null;
  }

  return (
    <ListingMap
      ref={mapRef}
      properties={data?.data || []}
      latitude={query["map-lat"] || query["search-origin-lat"]}
      longitude={query["map-lng"] || query["search-origin-lng"]}
      zoom={query["map-zoom"]}
      onZoom={(e) => {
        onMapZoomChange(e.viewState.zoom);
      }}
      onMove={(e) => {
        onMapMove(e.viewState.latitude, e.viewState.longitude);
      }}
    />
  );
};

export default dynamic(() => Promise.resolve(ListingMapViewContainer), {
  ssr: false
});
