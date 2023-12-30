"use client";

import css from "./ListingMap.module.css";
import Map, { Layer, MapRef, Marker, Source } from "react-map-gl";
import MapPropertyMarker from "../MapPropertyMarker/MapPropertyMarker";
import "mapbox-gl/dist/mapbox-gl.css";
import { useIndexConnector } from "../IndexConnector/IndexConnector";
import Link from "next/link";
import { Bounds, Property, RealEstateQuery } from "@rems/types";
import React from "react";
import circle from "@turf/circle";
import { lineString } from "@turf/helpers";

const TOKEN =
  "pk.eyJ1IjoiamFrZS1lbGRlciIsImEiOiJjbGZtbm12d28wZGp3M3JyemlrNnp1cmRvIn0.ovmQBkbXdCh-w_rUJ82GZA";

type MapProps = React.ComponentProps<typeof Map>;

type Props = {
  lat: number;
  lng: number;
  bounds: Bounds;
  properties: Property[];
  radius: RealEstateQuery["locationSource"]["radius"];
  showRadius: boolean;
} & MapProps;

type RadiusProps = {
  lat: number;
  lng: number;
  radius: RealEstateQuery["locationSource"]["radius"];
  show: boolean;
};

const Radius = ({ lat, lng, radius, show }: RadiusProps) => {
  if (!show || !radius) {
    return null;
  }

  const c = circle([lng, lat] as any, radius, { units: "meters" } as any);
  const line = lineString(c.geometry.coordinates[0]);

  return (
    <>
      <Source type="geojson" data={c}>
        <Layer
          type="fill"
          paint={{ "fill-color": "#b248e3", "fill-opacity": 0.14 }}
        />
      </Source>
      <Source type="geojson" data={line}>
        <Layer
          type="line"
          paint={{
            "line-color": "#9b20d4",
            "line-opacity": 0.6
          }}
        />
      </Source>
    </>
  );
};

const ListingMap = React.forwardRef<MapRef, Props>(
  (
    { properties, lat, lng, radius, showRadius, bounds, zoom, ...rest },
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
              mapStyle="mapbox://styles/jake-elder/clkpaxw5d00ly01qyah2jbomw"
              initialViewState={{
                zoom,
                bounds: [bounds.sw, bounds.ne]
              }}
              {...rest}
            >
              {<Radius lat={lat} lng={lng} radius={radius} show={showRadius} />}
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
