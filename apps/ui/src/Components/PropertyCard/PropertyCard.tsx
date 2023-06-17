import React from "react";
import css from "./PropertyCard.module.css";
import { Property } from "@rems/types";

type Props = {
  property: Property;
};

const PropertyCard = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["images"]}></div>
    </div>
  );
};

export default PropertyCard;
