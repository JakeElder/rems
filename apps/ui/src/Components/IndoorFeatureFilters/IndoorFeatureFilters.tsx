import React from "react";
import css from "./IndoorFeatureFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";
import CheckboxGrid from "../CheckboxGrid";

type Props = {};

const IndoorFeatureFilters = ({}: Props) => {
  const { indoorFeatures } = useFilters();
  const { query, onCheckedChange } = useRealEstateQuery();

  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={indoorFeatures.map((t) => (
            <Checkbox
              onCheckedChange={(checked) =>
                onCheckedChange("indoor-features", t.slug, checked)
              }
              checked={query["indoor-features"].includes(t.slug)}
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
