import React from "react";
import css from "./PropertyCard.module.css";
import { Property } from "@rems/types";
import SimpleImageCarousel from "../SimpleImageCarousel/SimpleImageCarousel";
import { propertyToCarouselImages } from "../../adapters";

type Props = {
  property: Property;
};

const PropertyCard = ({ property }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["images"]}>
        <SimpleImageCarousel images={propertyToCarouselImages(property)} />
      </div>
      <div className={css["spec"]}>
        <div className={css["price"]}>{property.formattedPurchasePrice}</div>
        <div className={css["beds-baths-area"]}>
          <span className={css["beds"]}>{property.bedrooms} beds</span>
          <span className={css["separator"]}>&bull;</span>
          <span className={css["baths"]}>{property.bathrooms} baths</span>
          <span className={css["separator"]}>&bull;</span>
          <span className={css["area"]}>{property.area}m&#178;</span>
        </div>
        <div className={css["title"]}>{property.title}</div>
      </div>
    </div>
  );
};

export default PropertyCard;
