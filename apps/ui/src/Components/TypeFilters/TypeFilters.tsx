import React from "react";
import css from "./TypeFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import CheckboxGrid from "../CheckboxGrid";
import { PropertyType } from "@rems/types";

type Props = {
  id: string;
  types: PropertyType[];
  onChange: (filter: PropertyType, checked: boolean) => void;
  isChecked: (filter: PropertyType) => boolean;
};

const TypeFilters = ({ id, types, onChange, isChecked }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={types.map((t) => (
            <Checkbox
              onCheckedChange={(checked) =>
                onChange(t, checked !== "indeterminate" && checked)
              }
              checked={isChecked(t)}
              key={t.slug}
              name="property-types[]"
              value={t.slug}
              id={`${id}_${t.slug}`}
              label={t.name}
            />
          ))}
        />
      </div>
    </div>
  );
};

export default TypeFilters;
