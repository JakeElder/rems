"use client";

import React, { useEffect, useMemo, useRef } from "react";
import css from "./AreaMap.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import mapbox from "mapbox-gl";
import { Property } from "@rems/types";
import MapPropertyMarker from "../MapPropertyMarker/MapPropertyMarker";

mapbox.accessToken =
  "pk.eyJ1IjoiamFrZS1lbGRlciIsImEiOiJjbGZtbm12d28wZGp3M3JyemlrNnp1cmRvIn0.ovmQBkbXdCh-w_rUJ82GZA";

type Props = {
  property: Property;
};

const AreaMap = ({ property }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const $marker = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapbox.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    map.current = new mapbox.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jake-elder/clfmqca38006901pcm2wsjgqr",
      center: [property.location!.lng, property.location!.lat],
      zoom: 16
    });

    new mapbox.Marker($marker.current!)
      .setLngLat([property.location!.lng, property.location!.lat])
      .addTo(map.current!);
  }, []);

  return (
    <div className={css["root"]}>
      <div className={css["content"]}>
        <div className={css["markers"]}>
          <MapPropertyMarker
            key={property.id}
            property={property}
            ref={$marker}
          />
        </div>
        <div className={css["map-container"]} ref={mapContainer} />
      </div>
    </div>
  );
};

export default AreaMap;
