import React from "react";
import ToggleGroup from "../ToggleGroup";
import css from "./TypeFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import { useFilters } from "../../Utils/FiltersContext";

type Props = {};

const TypeFilters = ({}: Props) => {
  const { propertyTypes } = useFilters();

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
        {propertyTypes.map((t) => (
          <Checkbox key={t.slug} id={t.slug} label={t.name} />
        ))}
      </div>
    </div>
  );
};

export default TypeFilters;
