import React from "react";
import css from "./PlacesMessage.module.css";
import { PlaceData } from "@googlemaps/google-maps-services-js";
import { animated, useTransition } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";

type Props = {
  places: PlaceData[];
};

const Rating = ({ rating }: { rating: number }) => {
  const emptyRange = Array.from(Array(5).keys(), (n) => n + 1);
  const fullRange = Array.from(Array(Math.ceil(rating)).keys(), (n) => n + 1);
  const remainder = rating % Math.floor(rating);

  return (
    <div className={css["rating"]}>
      <div className={css["stars"]}>
        <div className={css["empty"]}>
          {emptyRange.map((idx) => (
            <FontAwesomeIcon key={idx} icon={faStarOutline} size="2xs" />
          ))}
        </div>
        <div className={css["full"]}>
          {fullRange.map((idx) => {
            return (
              <span className={css["star"]}>
                <span className={css["hidden"]}>
                  <FontAwesomeIcon key={idx} icon={faStarSolid} size="2xs" />
                </span>
                <span
                  className={css["visible"]}
                  style={{
                    width:
                      idx < fullRange.length ? "100%" : `${remainder * 100}%`
                  }}
                >
                  <FontAwesomeIcon key={idx} icon={faStarSolid} size="2xs" />
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Place = ({ photos, name, rating }: PlaceData) => {
  const photoId = photos[0].photo_reference;
  return (
    <li className={css["place"]}>
      <div className={css["name"]}>{name}</div>
      <div className={css["image"]}>
        <div className={css["pad"]}>
          <img src={`http://localhost:3003/places/image/${photoId}`} />
          <Rating rating={rating} />
        </div>
      </div>
    </li>
  );
};

const PlacesMessage = ({ places }: Props) => {
  const transition = useTransition(places, {
    trail: 300 / places.length,
    from: { opacity: 0, y: 14 },
    enter: { opacity: 1, y: 0 }
  });

  return (
    <ul className={css["root"]}>
      {transition((style, p) => (
        <animated.div style={style}>
          <Place key={p.place_id} {...p} />
        </animated.div>
      ))}
    </ul>
  );
};

export default PlacesMessage;
