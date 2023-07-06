import React from "react";
import css from "./LotFeatureFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";
import CheckboxGrid from "../CheckboxGrid";

type Props = {};

const LotFeatureFilters = ({}: Props) => {
  const { lotFeatures } = useFilters();
  const { query, onCheckedChange } = useRealEstateQuery();

  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={lotFeatures.map((t) => (
            <Checkbox
              onCheckedChange={(checked) =>
                onCheckedChange("lot-features", t.slug, checked)
              }
              checked={query["lot-features"].includes(t.slug)}
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
