"use client";

import css from "./ListingMap.module.css";
import { Property } from "@rems/types";
import Map, { Marker } from "react-map-gl";
import MapPropertyMarker from "../MapPropertyMarker/MapPropertyMarker";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN =
  "pk.eyJ1IjoiamFrZS1lbGRlciIsImEiOiJjbGZtbm12d28wZGp3M3JyemlrNnp1cmRvIn0.ovmQBkbXdCh-w_rUJ82GZA";

type Props = {
  properties: Property[];
};

const ListingMap = ({ properties }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["overlay"]} />
      <div className={css["content"]}>
        <div className={css["map-container"]}>
          <Map
            mapboxAccessToken={TOKEN}
            mapStyle="mapbox://styles/jake-elder/clfmqca38006901pcm2wsjgqr"
            initialViewState={{
              longitude: 100.5018,
              latitude: 13.6563,
              zoom: 9
            }}
          >
            {properties.map((p) => (
              <Marker
                key={p.id}
                longitude={p.location!.lng}
                latitude={p.location!.lat}
              >
                <MapPropertyMarker property={p} />
              </Marker>
            ))}
          </Map>
        </div>
      </div>
    </div>
  );
};

export default ListingMap;
