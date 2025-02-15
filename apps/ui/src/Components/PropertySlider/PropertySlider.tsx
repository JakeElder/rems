"use client";

import React, { MutableRefObject, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { Property } from "@rems/types";
import css from "./PropertySlider.module.css";
import Img from "../../Elements/Img";

type Props = { properties: Property[] };

const Content = ({ property }: { property: Property }) => {
  if (property.availableToPurchase) {
    return (
      <>
        <h3 className={css["price"]}>{property.formattedPurchasePrice}</h3>
        <p className={css["title"]}>{property.title}</p>
      </>
    );
  }

  return (
    <>
      <h3 className={css["price"]}>
        <div className={css["rental-price-and-pm"]}>
          <span className={css["rental-price"]}>
            {property.formattedRentalPrice}
          </span>
          <span className={css["pm"]}>p/m</span>
        </div>
      </h3>
      <p className={css["title"]}>{property.title}</p>
    </>
  );
};

const Card = ({ property }: { property: Property }) => {
  const img = property.images![0];
  return (
    <a className={css["card"]} href={property.url}>
      <Img alt={property.title} {...img} height="auto" />
      <div className={css["content"]}>
        <Content property={property} />
      </div>
    </a>
  );
};

const PropertySlider = ({ properties }: Props) => {
  const $root = useRef<HTMLDivElement>(null);
  const { events } = useDraggable($root as MutableRefObject<HTMLDivElement>);

  return (
    <div className={css["root"]} ref={$root} {...events}>
      {properties.map((p) => (
        <Card key={p.id} property={p} />
      ))}
    </div>
  );
};

export default PropertySlider;
