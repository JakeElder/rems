"use client";

import React, { useState } from "react";
import css from "./PropertyRow.module.css";
import { Property, RealEstateQuery } from "@rems/types";
import SimpleImageCarousel from "../SimpleImageCarousel";
import ArrowNav from "../ArrowNav";
import { useIndexConnector } from "../IndexConnector/IndexConnector";
import Dotdotdot from "react-dotdotdot";
import { animated, useSpring, config } from "@react-spring/web";

type Props = {
  property: Property;
  type: RealEstateQuery["budgetAndAvailability"]["type"];
  active: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

const Price = ({ property, type }: Pick<Props, "property" | "type">) => {
  if (type === "SALE") {
    return (
      <div className={css["price"]}>{property.formattedPurchasePrice}</div>
    );
  }

  return (
    <div className={css["rental-price-and-pm"]}>
      <span className={css["rental-price"]}>
        {property.formattedRentalPrice}
      </span>
      <span className={css["pm"]}>p/m</span>
    </div>
  );
};

const PropertyRow = ({ property, type, active, onClick }: Props) => {
  const [image, setImage] = useState(0);

  const style = useSpring({
    background: active ? "#fef7ff" : "#fff",
    borderColor: active ? "#9c54bd" : "#d6d6d6",
    titleColor: active ? "#9c54bd" : "#000",
    hrColor: active ? "#9c54bd" : "#f5f5f5",
    hrOpacity: active ? 0.3 : 1,
    descriptionColor: active ? "#777" : "#bbb",
    config: config.stiff
  });

  const { setMouseOver, setMouseOut, activeProperty } = useIndexConnector();

  return (
    <animated.div
      className={css["root"]}
      style={{
        borderColor: style.borderColor,
        background: style.background
      }}
      onMouseEnter={() => setMouseOver(property.id)}
      onMouseLeave={() => setMouseOut()}
      onClick={onClick}
    >
      <div className={css["images"]}>
        <SimpleImageCarousel
          images={property.images!}
          index={image}
          onIndexChange={setImage}
        >
          <div className={css["arrow-nav"]}>
            <ArrowNav
              show={activeProperty === property.id}
              hasNext={image !== property.images!.length - 1}
              hasPrev={image !== 0}
              onNext={() => setImage(image + 1)}
              onPrev={() => setImage(image - 1)}
            />
          </div>
        </SimpleImageCarousel>
      </div>
      <div className={css["link"]}>
        <div className={css["details"]}>
          <div className={css["title"]}>{property.title}</div>
          <animated.div
            className={css["hr"]}
            style={{
              background: style.hrColor,
              opacity: style.hrOpacity
            }}
          />
          <animated.div
            className={css["description"]}
            style={{ color: style.descriptionColor }}
          >
            <Dotdotdot clamp={3}>{property.description}</Dotdotdot>
          </animated.div>
          <div className={css["spec-and-price"]}>
            <div className={css["beds-baths-area"]}>
              <span className={css["beds"]}>{property.bedrooms} beds</span>
              <span className={css["separator"]}>&bull;</span>
              <span className={css["baths"]}>{property.bathrooms} baths</span>
              <span className={css["separator"]}>&bull;</span>
              <span className={css["area"]}>{property.livingArea}m&#178;</span>
            </div>
            <Price property={property} type={type} />
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default PropertyRow;
