import React, { useState, forwardRef } from "react";
import css from "./MapPropertyMarker.module.css";
import { Property } from "@rems/types";
import Image from "next/image";
import { useSpring, useTransition, animated } from "@react-spring/web";
import cn from "classnames";

type Props = {
  property: Property;
};

const Bullet = () => <span className={css["bullet"]}>&bull;</span>;

const MapPropertyMarker = forwardRef<HTMLDivElement, Props>(
  ({ property }, ref) => {
    const image = property.images[0];
    const [mouseOver, setMouseOver] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);

    const { outlineWidth } = useSpring(
      mouseOver ? { outlineWidth: 4 } : { outlineWidth: 0 }
    );

    const transition = useTransition(mouseOver, {
      from: { opacity: 0, transform: "scale(0.9)" },
      enter: { opacity: 1, transform: "scale(1)" },
      leave: { opacity: 0, transform: "scale(0.9)" },
      onDestroyed: (item) => item && setPopupOpen(false)
    });

    return (
      <div
        ref={ref}
        className={cn(css["root"], { [css["open"]]: popupOpen })}
        onMouseEnter={() => {
          setMouseOver(true);
          setPopupOpen(true);
        }}
        onMouseLeave={() => setMouseOver(false)}
      >
        <animated.div className={css["marker"]} style={{ outlineWidth }} />
        {transition((style, open) => {
          if (!open) {
            return null;
          }

          return (
            <animated.div className={css["popup-container"]} style={style}>
              <div className={css["popup"]}>
                <div className={css["property"]}>
                  <div className={css["image-container"]}>
                    <Image
                      src={image.src}
                      alt={property.title}
                      width={image.width}
                      height={image.height}
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
                      <span className={css["area"]}>{property.area}m²</span>
                    </div>
                    <h2 className={css["heading"]}>{property.title}</h2>
                  </div>
                </div>
              </div>
            </animated.div>
          );
        })}
      </div>
    );
  }
);

export default MapPropertyMarker;
