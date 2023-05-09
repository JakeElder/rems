import React from "react";
import css from "./PropertySlider.module.css";
import { Property } from "@rems/types";
import Image from "next/image";

type Props = { properties: Property[] };

const Card = ({ property }: { property: Property }) => {
  const img = property.images[0];
  return (
    <a className={css["card"]} href="#">
      <Image
        alt={property.title}
        src={img.src}
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
  return (
    <div className={css["root"]}>
      {properties.map((p) => (
        <Card key={p.id} property={p} />
      ))}
    </div>
  );
};

export default PropertySlider;
