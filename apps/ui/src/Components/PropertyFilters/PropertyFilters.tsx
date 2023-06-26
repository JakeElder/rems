import React from "react";
import css from "./PropertyFilters.module.css";
import TypeFilters from "../TypeFilters";
import PriceRange from "../PriceRange";
import BedsFilter from "../BedsFilter";
import BathroomsFilter from "../BathroomsFilter";
import CheckboxGrid from "../CheckboxGrid";
import { useFilters } from "../../Utils/FiltersContext";
import Checkbox from "../../Elements/Checkbox";

type Props = {};

const PropertyFilters = ({}: Props) => {
  const { viewTypes, outdoorFeatures, indoorFeatures, lotFeatures } =
    useFilters();
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
          <CheckboxGrid
            items={viewTypes.map((t) => (
              <Checkbox key={t.slug} id={t.slug} label={t.name} />
            ))}
          />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Indoor Features</div>
        <div className={css["filters"]}>
          <CheckboxGrid
            items={indoorFeatures.map((t) => (
              <Checkbox key={t.slug} id={t.slug} label={t.name} />
            ))}
          />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Outdoor Features</div>
        <div className={css["filters"]}>
          <CheckboxGrid
            items={outdoorFeatures.map((t) => (
              <Checkbox key={t.slug} id={t.slug} label={t.name} />
            ))}
          />
        </div>
      </div>
      <div className={css["section"]}>
        <div className={css["header"]}>Lot Features</div>
        <div className={css["filters"]}>
          <CheckboxGrid
            items={lotFeatures.map((t) => (
              <Checkbox key={t.slug} id={t.slug} label={t.name} />
            ))}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
