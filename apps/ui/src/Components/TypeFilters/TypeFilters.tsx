import React from "react";
import css from "./TypeFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import { useFilters } from "../../Utils/FiltersContext";
import CheckboxGrid from "../CheckboxGrid";

type Props = {};

const TypeFilters = ({}: Props) => {
  const { propertyTypes } = useFilters();

  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={propertyTypes.map((t) => (
            <Checkbox key={t.slug} id={t.slug} label={t.name} />
          ))}
        />
      </div>
    </div>
  );
};

export default TypeFilters;
