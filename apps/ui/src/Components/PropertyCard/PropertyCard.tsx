import React from "react";
import Link from "next/link";
import css from "./PropertyCard.module.css";
import { Property } from "@rems/types";
import SimpleImageCarousel from "../SimpleImageCarousel/SimpleImageCarousel";
import { propertyToCarouselImages } from "../../adapters";

type Props = {
  property: Property;
  onClick?: React.ComponentProps<typeof Link>["onClick"];
  link?: string;
};

const PropertyCard = ({ property, link = "#", onClick }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["images"]}>
        <SimpleImageCarousel images={propertyToCarouselImages(property)} />
      </div>
      <Link href={link} onClick={onClick}>
        <div className={css["spec"]}>
          <div className={css["price"]}>{property.formattedPurchasePrice}</div>
          <div className={css["beds-baths-area"]}>
            <span className={css["beds"]}>{property.bedrooms} beds</span>
            <span className={css["separator"]}>&bull;</span>
            <span className={css["baths"]}>{property.bathrooms} baths</span>
            <span className={css["separator"]}>&bull;</span>
            <span className={css["area"]}>{property.livingArea}m&#178;</span>
          </div>
          <div className={css["title"]}>{property.title}</div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
