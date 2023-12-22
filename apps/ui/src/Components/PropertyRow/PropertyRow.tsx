"use client";

import React, { useState } from "react";
import Link from "next/link";
import css from "./PropertyRow.module.css";
import { Property, RealEstateQuery } from "@rems/types";
import SimpleImageCarousel from "../SimpleImageCarousel";
import ArrowNav from "../ArrowNav";
import { useIndexConnector } from "../IndexConnector/IndexConnector";
import Dotdotdot from "react-dotdotdot";
import cn from "classnames";

type Props = {
  property: Property;
  type: RealEstateQuery["budgetAndAvailability"]["type"];
  active: boolean;
};

const Price = ({ property, type }: Props) => {
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

const PropertyRow = ({ property, type, active }: Props) => {
  const [image, setImage] = useState(0);

  const { setMouseOver, setMouseOut, activeProperty } = useIndexConnector();

  return (
    <div
      className={cn(css["root"], { [css['active']]: active })}
      onMouseEnter={() => setMouseOver(property.id)}
      onMouseLeave={() => setMouseOut()}
    >
      <div className={css["images"]}>
        <SimpleImageCarousel
          images={property.images!}
          index={image}
          onIndexChange={setImage}
          link={property.url}
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
      <Link href={property.url} draggable="false" className={css["link"]}>
        <div className={css["details"]}>
          <div className={css["title"]}>{property.title}</div>
          <div className={css["hr"]} />
          <div className={css["description"]}>
            <Dotdotdot clamp={3}>{property.description}</Dotdotdot>
          </div>
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
      </Link>
    </div>
  );
};

export default PropertyRow;
