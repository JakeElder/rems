"use client";

import css from "./ListingMap.module.css";
import Map, { Marker } from "react-map-gl";
import MapPropertyMarker from "../MapPropertyMarker/MapPropertyMarker";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRealEstateQuery } from "../RealEstateQueryController";
import { useIndexConnector } from "../IndexConnector/IndexConnector";
import Link from "next/link";

const TOKEN =
  "pk.eyJ1IjoiamFrZS1lbGRlciIsImEiOiJjbGZtbm12d28wZGp3M3JyemlrNnp1cmRvIn0.ovmQBkbXdCh-w_rUJ82GZA";

type Props = {};

const ListingMap = ({}: Props) => {
  const { state } = useRealEstateQuery();
  const properties = state.initialLoad ? [] : state.result.data;
  const withGeo = properties.filter((p) => !!p.location);
  const { setMouseOver, setMouseOut, activeProperty } = useIndexConnector();

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
};

export default ListingMap;
