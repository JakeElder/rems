import React from "react";
import css from "./ViewTypeFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import CheckboxGrid from "../CheckboxGrid";
import { ViewType } from "@rems/types";

type Props = {
  types: ViewType[];
  onChange: (value: string, checked: boolean) => void;
  isChecked: (value: string) => boolean;
};

const ViewTypeFilters = ({ types, onChange, isChecked }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={types.map((t) => (
            <Checkbox
              onCheckedChange={(checked) =>
                onChange(t.slug, checked !== "indeterminate" && checked)
              }
              checked={isChecked(t.slug)}
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
