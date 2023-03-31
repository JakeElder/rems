"use client";

import React, { useEffect, useMemo, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import css from "./ListingMap.module.css";
import mapbox from "mapbox-gl";
import { Property } from "@rems/types";
import MapPropertyMarker from "../MapPropertyMarker/MapPropertyMarker";

mapbox.accessToken =
  "pk.eyJ1IjoiamFrZS1lbGRlciIsImEiOiJjbGZtbm12d28wZGp3M3JyemlrNnp1cmRvIn0.ovmQBkbXdCh-w_rUJ82GZA";

type Props = {
  properties: Property[];
};

const ListingMap = ({ properties }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapbox.Map | null>(null);

  const domRefs = useMemo(() => new WeakMap(), []);

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    map.current = new mapbox.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jake-elder/clfmqca38006901pcm2wsjgqr",
      center: [100.5018, 13.6563],
      zoom: 9
    });

    properties.forEach((p) => {
      new mapbox.Marker(domRefs.get(p))
        .setLngLat([p.location!.lng, p.location!.lat])
        .addTo(map.current!);
    });
  }, []);

  return (
    <div className={css["root"]}>
      <div className={css["overlay"]} />
      <div className={css["content"]}>
        <div className={css["markers"]}>
          {properties.map((p) => {
            return (
              <MapPropertyMarker
                key={p.id}
                property={p}
                ref={(r) => r && domRefs.set(p, r)}
              />
            );
          })}
        </div>
        <div className={css["map-container"]} ref={mapContainer} />
      </div>
    </div>
  );
};

export default ListingMap;
