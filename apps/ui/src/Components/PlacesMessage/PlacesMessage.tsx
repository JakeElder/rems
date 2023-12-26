import React from "react";
import css from "./PlacesMessage.module.css";
import { PlaceData } from "@googlemaps/google-maps-services-js";

type Props = {
  places: PlaceData[];
};

const Place = ({ photos }: PlaceData) => {
  const photoId = photos[0].photo_reference;
  return (
    <li className={css["place"]}>
      <div className={css["pad"]}>
        <img src={`http://localhost:3003/places/image/${photoId}`} />
      </div>
    </li>
  );
};

const PlacesMessage = ({ places }: Props) => {
  return (
    <ul className={css["root"]}>
      {places.map((p) => (
        <Place key={p.place_id} {...p} />
      ))}
    </ul>
  );
};

export default PlacesMessage;
