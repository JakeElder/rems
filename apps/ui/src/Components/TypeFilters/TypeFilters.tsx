import React from "react";
import ToggleGroup from "../ToggleGroup";
import css from "./TypeFilters.module.css";
import Checkbox from "../../Elements/Checkbox";

type Props = {};

const TypeFilters = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["rent-or-sale"]}>
        <ToggleGroup
          defaultValue="rent"
          items={[
            { label: "Rent", value: "rent" },
            { label: "Sale", value: "sale" }
          ]}
        />
      </div>
      <div className={css["types"]}>
        <Checkbox id="apartment" label="Apartment" />
        <Checkbox id="condo" label="Condo" />
      </div>
    </div>
  );
};

export default TypeFilters;
