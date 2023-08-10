"use client";

import React from "react";
import css from "./AreaMap.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl";
import { Image, Property } from "@rems/types";
import MapPropertyMarker from "../MapPropertyMarker/MapPropertyMarker";

const TOKEN =
  "pk.eyJ1IjoiamFrZS1lbGRlciIsImEiOiJjbGZtbm12d28wZGp3M3JyemlrNnp1cmRvIn0.ovmQBkbXdCh-w_rUJ82GZA";

type Props = {
  property: Property;
  image: Image;
};

const AreaMap = ({ property, image }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["content"]}>
        <div className={css["map-container"]}>
          <Map
            mapboxAccessToken={TOKEN}
            mapStyle="mapbox://styles/jake-elder/clkpaxw5d00ly01qyah2jbomw"
            initialViewState={{
              longitude: property.location.lng,
              latitude: property.location.lat,
              zoom: 16
            }}
          >
            <Marker
              longitude={property.location.lng}
              latitude={property.location.lat}
            >
              <MapPropertyMarker
                property={property}
                image={image}
                open={false}
              />
            </Marker>
          </Map>
        </div>
      </div>
    </div>
  );
};

export default AreaMap;
