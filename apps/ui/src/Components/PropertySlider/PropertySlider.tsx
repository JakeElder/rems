"use client";

import React, { MutableRefObject, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { Property } from "@rems/types";
import Image from "next/image";
import css from "./PropertySlider.module.css";

type Props = { properties: Property[] };

const Card = ({ property }: { property: Property }) => {
  const img = property.images![0];
  return (
    <a className={css["card"]} href={property.url}>
      <Image
        alt={property.title}
        src={img.url}
        width={img.width}
        height={img.height}
      />
      <div className={css["content"]}>
        <h3 className={css["price"]}>{property.formattedPurchasePrice}</h3>
        <p className={css["title"]}>{property.title}</p>
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
