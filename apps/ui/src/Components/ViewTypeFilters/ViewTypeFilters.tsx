import React from "react";
import css from "./ViewTypeFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import CheckboxGrid from "../CheckboxGrid";
import { ViewType } from "@rems/types";

type Props = {
  types: ViewType[];
  onChange: (filter: ViewType, checked: boolean) => void;
  isChecked: (filter: ViewType) => boolean;
};

const ViewTypeFilters = ({ types, onChange, isChecked }: Props) => {
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
              name="view-type[]"
              value={t.slug}
              id={`${t.slug}_filter`}
              label={t.name}
            />
          ))}
        />
      </div>
    </div>
  );
};

export default ViewTypeFilters;
