import React from "react";
import css from "./LotFeatureFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import CheckboxGrid from "../CheckboxGrid";
import { LotFeature } from "@rems/types";

type Props = {
  features: LotFeature[];
  onChange: (value: string, checked: boolean) => void;
  isChecked: (value: string) => boolean;
};

const LotFeatureFilters = ({ features, onChange, isChecked }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={features.map((t) => (
            <Checkbox
              onCheckedChange={(checked) =>
                onChange(t.slug, checked !== "indeterminate" && checked)
              }
              checked={isChecked(t.slug)}
              key={t.slug}
              name="lot-features[]"
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

export default LotFeatureFilters;
