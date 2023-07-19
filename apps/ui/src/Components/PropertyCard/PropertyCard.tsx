"use client";

import React, { useState } from "react";
import Link from "next/link";
import css from "./PropertyCard.module.css";
import { Property, RealEstateQuery } from "@rems/types";
import SimpleImageCarousel from "../SimpleImageCarousel/SimpleImageCarousel";
import { propertyToCarouselImages } from "../../adapters";
import { useRealEstateQuery } from "../RealEstateQueryController/RealEstateQueryController";
import ArrowNav from "../ArrowNav/ArrowNav";

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
  const [image, setImage] = useState(0);

  const images = propertyToCarouselImages(property);
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <div
      className={css["root"]}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <div className={css["images"]}>
        <SimpleImageCarousel
          images={images}
          index={image}
          onIndexChange={setImage}
          link={link}
        >
          <div className={css["arrow-nav"]}>
            <ArrowNav
              show={mouseOver}
              hasNext={image !== images.length - 1}
              hasPrev={image !== 0}
              onNext={() => setImage(image + 1)}
              onPrev={() => setImage(image - 1)}
            />
          </div>
        </SimpleImageCarousel>
      </div>
      <Link href={link} draggable="false" className={css["link"]}>
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
