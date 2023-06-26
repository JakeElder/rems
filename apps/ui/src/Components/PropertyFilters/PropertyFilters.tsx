import React from "react";
import css from "./PropertyFilters.module.css";
import TypeFilters from "../TypeFilters/TypeFilters";
import PriceRange from "../PriceRange/PriceRange";
import BedsFilter from "../BedsFilter/BedsFilter";
import BathroomsFilter from "../BathroomsFilter/BathroomsFilter";

type Props = {};

const PropertyFilters = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["section"]}>
        <div className={css["header"]}>Property Type</div>
        <div className={css["filters"]}>
          <TypeFilters />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Price Range</div>
        <div className={css["filters"]}>
          <PriceRange />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Bedrooms</div>
        <div className={css["filters"]}>
          <BedsFilter />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Bathrooms</div>
        <div className={css["filters"]}>
          <BathroomsFilter />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>View</div>
        <div className={css["filters"]}>
          <BathroomsFilter />
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
