"use client";

import css from "./ListingMap.module.css";
import Map, { Layer, MapRef, Marker, Source } from "react-map-gl";
import MapPropertyMarker from "../MapPropertyMarker/MapPropertyMarker";
import "mapbox-gl/dist/mapbox-gl.css";
import { useIndexConnector } from "../IndexConnector/IndexConnector";
import Link from "next/link";
import { Property, RealEstateQuery } from "@rems/types";
import React from "react";
import { circle, lineString } from "@turf/turf";
import { Required } from "utility-types";

const TOKEN =
  "pk.eyJ1IjoiamFrZS1lbGRlciIsImEiOiJjbGZtbm12d28wZGp3M3JyemlrNnp1cmRvIn0.ovmQBkbXdCh-w_rUJ82GZA";

type Props = Required<
  React.ComponentProps<typeof Map>,
  "longitude" | "latitude"
> & {
  properties: Property[];
  radius: RealEstateQuery["search-radius"];
  searchLat: RealEstateQuery["search-origin-lat"];
  searchLng: RealEstateQuery["search-origin-lng"];
  showRadius: boolean;
};

type RadiusProps = {
  lat: RealEstateQuery["search-origin-lat"];
  lng: RealEstateQuery["search-origin-lng"];
  radius: RealEstateQuery["search-radius"];
  show: boolean;
};

const Radius = ({ lat, lng, radius, show }: RadiusProps) => {
  if (!show) {
    return null;
  }

  const c = circle([lng, lat], radius, { units: "meters" });
  const line = lineString(c.geometry.coordinates[0]);

  return (
    <>
      <Source type="geojson" data={c}>
        <Layer
          type="fill"
          paint={{ "fill-color": "#fff", "fill-opacity": 0.25 }}
        />
      </Source>
      <Source type="geojson" data={line}>
        <Layer
          type="line"
          paint={{
            "line-color": "#000",
            "line-opacity": 0.6
          }}
        />
      </Source>
    </>
  );
};

const ListingMap = React.forwardRef<MapRef, Props>(
  (
    {
      properties,
      longitude,
      latitude,
      zoom,
      radius,
      searchLat,
      searchLng,
      showRadius,
      ...props
    },
    ref
  ) => {
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
              <Radius
                lat={searchLat}
                lng={searchLng}
                radius={radius}
                show={showRadius}
              />
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
                      image={p.images![0]}
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
