import React from "react";
import Link from "next/link";
import css from "./PropertyCard.module.css";
import { Property, RealEstateQuery } from "@rems/types";
import SimpleImageCarousel from "../SimpleImageCarousel/SimpleImageCarousel";
import { propertyToCarouselImages } from "../../adapters";
import { useRealEstateQuery } from "../RealEstateQueryController/RealEstateQueryController";

type Props = {
  property: Property;
  link?: string;
};

const Price = ({
  property,
  type
}: {
  property: Property;
  type: RealEstateQuery["availability"];
}) => {
  if (type === "sale") {
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

const PropertyCard = ({ property, link = "#" }: Props) => {
  const { state } = useRealEstateQuery();
  return (
    <div className={css["root"]}>
      <div className={css["images"]}>
        <SimpleImageCarousel images={propertyToCarouselImages(property)} />
      </div>
      <Link href={link}>
        <div className={css["spec"]}>
          <Price property={property} type={state.query!["availability"]} />
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
