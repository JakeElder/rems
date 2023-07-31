"use client";

import React, { useEffect, useRef } from "react";
import useRealEstateQuery from "@/hooks/use-real-estate-query";
import { ListingMap } from "@rems/ui";
import useProperties from "@/hooks/use-properties";
import type { MapRef } from "react-map-gl";
import usePrevious from "use-previous";
import dynamic from "next/dynamic";
import useRealEstateIndexPageState from "@/hooks/use-real-estate-index-page-state";
import { observer } from "@legendapp/state/react";
import { useDebouncedCallback } from "use-debounce";

type Props = {};

const ListingMapViewContainer = ({}: Props) => {
  const mapRef = useRef<MapRef>();
  const { query, onMapZoomChange, onMapMove, isReady } = useRealEstateQuery();
  const previousQuery = usePrevious(query);
  const { data } = useProperties({ limit: false });
  const { radius, mapBounds } = useRealEstateIndexPageState();

  useEffect(() => {
    if (!isReady || !previousQuery || !mapRef.current) {
      return;
    }
    setTimeout(() => {
      mapRef.current!.panTo([
        query["search-origin-lng"],
        query["search-origin-lat"]
      ]);
    }, 200);
  }, [query["search-origin-lat"], query["search-origin-lng"]]);

  useEffect(() => {
    if (!isReady || !previousQuery || !mapRef.current) {
      return;
    }
    mapRef.current.zoomTo(query["map-zoom"]);
  }, [query["map-zoom"]]);

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
      latitude={query["map-lat"] || query["search-origin-lat"]}
      longitude={query["map-lng"] || query["search-origin-lng"]}
      searchLat={query["search-origin-lat"]}
      searchLng={query["search-origin-lng"]}
      zoom={query["map-zoom"]}
      radius={radius.get()}
      onZoom={(e) => {
        onMapZoomChange(e.viewState.zoom);
      }}
      onLoad={() => setBounds()}
      onMove={(e) => {
        onMapMove(e.viewState.latitude, e.viewState.longitude);
        setBounds();
      }}
      showRadius={query["search-radius-enabled"] === "true"}
    />
  );
};

export default dynamic(
  () => Promise.resolve(observer(ListingMapViewContainer)),
  { ssr: false }
);
