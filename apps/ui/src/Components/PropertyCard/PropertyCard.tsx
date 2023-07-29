"use client";

import React, { useState } from "react";
import Link from "next/link";
import css from "./PropertyCard.module.css";
import { Property, RealEstateQuery } from "@rems/types";
import SimpleImageCarousel from "../SimpleImageCarousel";
import ArrowNav from "../ArrowNav";
import { useIndexConnector } from "../IndexConnector/IndexConnector";

type Props = {
  property: Property;
  type: RealEstateQuery["availability"];
};

const Price = ({ property, type }: Props) => {
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

const PropertyCard = ({ property, type }: Props) => {
  const [image, setImage] = useState(0);

  const { setMouseOver, setMouseOut, activeProperty } = useIndexConnector();

  return (
    <div
      className={css["root"]}
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
        <div className={css["spec"]}>
          <Price property={property} type={type} />
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
