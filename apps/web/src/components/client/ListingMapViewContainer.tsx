"use client";

import React, { useEffect, useRef } from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { ListingMap } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import type { MapRef } from "react-map-gl";
import usePrevious from "use-previous";
import dynamic from "next/dynamic";
import useRealEstateIndexPageState from "@/hooks/use-real-estate-index-page-state";
import { useDebouncedCallback } from "use-debounce";

type Props = {};

const ListingMapViewContainer = ({}: Props) => {
  const mapRef = useRef<MapRef>();
  const { query, onMapMove, isReady, serverQuery } = useRealEstateQuery();
  const previousQuery = usePrevious(query);
  const { data } = useProperties(serverQuery);
  const { mapBounds } = useRealEstateIndexPageState();

  useEffect(() => {
    if (!isReady || !previousQuery || !mapRef.current) {
      return;
    }
    setTimeout(() => {
      mapRef.current!.panTo([query["origin-lng"], query["origin-lat"]]);
    }, 200);
  }, [query["origin-lat"], query["origin-lng"]]);

  useEffect(() => {
    if (!isReady || !previousQuery || !mapRef.current) {
      return;
    }
    mapRef.current.zoomTo(query["zoom"]);
  }, [query["zoom"]]);

  const setBounds = useDebouncedCallback(() => {
    const bounds = mapRef.current?.getBounds();
    if (bounds) {
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      mapBounds.set({ sw, ne });
    }
  }, 200);

  if (!isReady) {
    return null;
  }

  return (
    <ListingMap
      ref={mapRef as any}
      properties={data?.data || []}
      latitude={query["lat"] || query["origin-lat"]}
      longitude={query["lng"] || query["origin-lng"]}
      searchLat={query["origin-lat"]}
      searchLng={query["origin-lng"]}
      zoom={query["zoom"]}
      radius={10000}
      onLoad={() => setBounds()}
      onMove={(e) => {
        onMapMove({
          zoom: e.viewState.zoom,
          lat: e.viewState.latitude,
          lng: e.viewState.longitude
        });
        setBounds();
      }}
      showRadius={query["radius-enabled"] === "true"}
    />
  );
};

export default dynamic(() => Promise.resolve(ListingMapViewContainer), {
  ssr: false
});
