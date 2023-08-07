import React, { forwardRef } from "react";
import css from "./MapPropertyMarker.module.css";
import { Property, Image } from "@rems/types";
import { useSpring, animated } from "@react-spring/web";
import Img from "../../Elements/Img";

type Props = {
  open: boolean;
  property: Property;
  image: Image;
};

const Bullet = () => <span className={css["bullet"]}>&bull;</span>;

const MapPropertyMarker = forwardRef<HTMLDivElement, Props>(
  ({ property, image, open }, ref) => {
    const { outlineWidth } = useSpring(
      open ? { outlineWidth: 20 } : { outlineWidth: 0 }
    );

    return (
      <div ref={ref} className={css["root"]}>
        <animated.div className={css["marker"]} style={{ outlineWidth }} />
        {open ? (
          <div className={css["popup-container"]}>
            <div className={css["popup"]}>
              <div className={css["property"]}>
                <div className={css["image-container"]}>
                  <Img
                    alt={property.title}
                    {...image}
                    className={css["image"]}
                  />
                </div>
                <div className={css["meta"]}>
                  <div className={css["price"]}>
                    {property.formattedPurchasePrice}
                  </div>
                  <div className={css["spec"]}>
                    <span className={css["beds"]}>
                      {property.bedrooms} Beds
                    </span>
                    <Bullet />
                    <span className={css["baths"]}>
                      {property.bathrooms} Baths
                    </span>
                    <Bullet />
                    <span className={css["area"]}>{property.livingArea}m²</span>
                  </div>
                  <h2 className={css["heading"]}>{property.title}</h2>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
);

export default MapPropertyMarker;
