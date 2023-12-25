"use client";

import React, { forwardRef, useState } from "react";
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
  selection: "USER" | "ASSISTANT" | null;
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

type ColorDef = {
  background: string;
  borderColor: string;
  titleColor: string;
  hrColor: string;
  hrOpacity: number;
  descriptionColor: string;
};

const DEFAULT_COLORS: ColorDef = {
  background: "#fff",
  borderColor: "#d6d6d6",
  titleColor: "#000",
  hrColor: "#f5f5f5",
  hrOpacity: 1,
  descriptionColor: "#bbb"
};

const USER_SELECTED_COLORS = {
  background: "#fafeff",
  borderColor: "#0dc4f2",
  titleColor: "#0ba5cb",
  hrColor: "#0dc4f2",
  hrOpacity: 0.3,
  descriptionColor: "#777"
};

const ASSISTANT_SELECTED_COLORS = {
  background: "#fef7ff",
  borderColor: "#9c54bd",
  titleColor: "#9c54bd",
  hrColor: "#9c54bd",
  hrOpacity: 0.3,
  descriptionColor: "#777"
};

const colors = (selection: Props["selection"]) => {
  if (selection === "USER") return USER_SELECTED_COLORS;
  if (selection === "ASSISTANT") return ASSISTANT_SELECTED_COLORS;
  return DEFAULT_COLORS;
};

const PropertyRow = forwardRef<HTMLDivElement, Props>(
  ({ property, type, selection, onClick }, ref) => {
    const [image, setImage] = useState(0);

    const style = useSpring({ ...colors(selection), config: config.stiff });

    const { setMouseOver, setMouseOut, activeProperty } = useIndexConnector();

    return (
      <animated.div
        ref={ref}
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
            <animated.div
              className={css["title"]}
              style={{ color: style.titleColor }}
            >
              {property.title}
            </animated.div>
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
                <span className={css["area"]}>
                  {property.livingArea}m&#178;
                </span>
              </div>
              <Price property={property} type={type} />
            </div>
          </div>
        </div>
      </animated.div>
    );
  }
);

export default PropertyRow;
