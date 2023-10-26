import React from "react";
import css from "./IndoorFeatureFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import CheckboxGrid from "../CheckboxGrid";
import { IndoorFeature } from "@rems/types";

type Props = {
  features: IndoorFeature[];
  onChange: (filter: IndoorFeature, checked: boolean) => void;
  isChecked: (filter: IndoorFeature) => boolean;
};

const IndoorFeatureFilters = ({ features, onChange, isChecked }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={features.map((t) => (
            <Checkbox
              onCheckedChange={(checked) =>
                onChange(t, checked !== "indeterminate" && checked)
              }
              checked={isChecked(t)}
              key={t.slug}
              name="indoor-features[]"
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

export default IndoorFeatureFilters;
