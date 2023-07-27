"use client";

import css from "./ListingMap.module.css";
import Map, { MapRef, Marker } from "react-map-gl";
import MapPropertyMarker from "../MapPropertyMarker/MapPropertyMarker";
import "mapbox-gl/dist/mapbox-gl.css";
import { useIndexConnector } from "../IndexConnector/IndexConnector";
import Link from "next/link";
import { Property } from "@rems/types";
import React from "react";

const TOKEN =
  "pk.eyJ1IjoiamFrZS1lbGRlciIsImEiOiJjbGZtbm12d28wZGp3M3JyemlrNnp1cmRvIn0.ovmQBkbXdCh-w_rUJ82GZA";

type Props = React.ComponentProps<typeof Map> & {
  properties: Property[];
};

const ListingMap = React.forwardRef<MapRef, Props>(
  ({ properties, longitude, latitude, zoom, ...props }, ref) => {
    const { setMouseOver, setMouseOut, activeProperty } = useIndexConnector();
    const withGeo = properties.filter((p) => !!p.location);

    return (
      <div className={css["root"]}>
        <div className={css["overlay"]} />
        <div className={css["content"]}>
          <div className={css["map-container"]}>
            <Map
              ref={ref}
              mapboxAccessToken={TOKEN}
              mapStyle="mapbox://styles/jake-elder/clfmqca38006901pcm2wsjgqr"
              initialViewState={{ longitude, latitude, zoom }}
              {...props}
            >
              {withGeo.map((p) => (
                <Link
                  key={p.id}
                  href={p.url}
                  onMouseOver={() => setMouseOver(p.id)}
                  onMouseOut={() => setMouseOut()}
                >
                  <Marker
                    longitude={p.location!.lng}
                    latitude={p.location!.lat}
                    style={{ zIndex: activeProperty === p.id ? 1 : 0 }}
                  >
                    <MapPropertyMarker
                      property={p}
                      open={activeProperty === p.id}
                    />
                  </Marker>
                </Link>
              ))}
            </Map>
          </div>
        </div>
      </div>
    );
  }
);

export default ListingMap;
