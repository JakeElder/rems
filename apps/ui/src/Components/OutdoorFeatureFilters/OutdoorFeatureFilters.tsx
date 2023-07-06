import React from "react";
import css from "./OutdoorFeatureFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";
import CheckboxGrid from "../CheckboxGrid";

type Props = {};

const OutdoorFeatureFilters = ({}: Props) => {
  const { outdoorFeatures } = useFilters();
  const { query, onCheckedChange } = useRealEstateQuery();

  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={outdoorFeatures.map((t) => (
            <Checkbox
              onCheckedChange={(checked) =>
                onCheckedChange("outdoor-features", t.slug, checked)
              }
              checked={query["outdoor-features"].includes(t.slug)}
              key={t.slug}
              name="outdoor-features[]"
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

export default OutdoorFeatureFilters;
