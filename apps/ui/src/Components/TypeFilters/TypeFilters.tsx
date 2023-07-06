import React from "react";
import css from "./TypeFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";
import CheckboxGrid from "../CheckboxGrid";

type Props = {
  id: string;
};

const TypeFilters = ({ id }: Props) => {
  const { propertyTypes } = useFilters();
  const { query, onCheckedChange } = useRealEstateQuery();

  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={propertyTypes.map((t) => (
            <Checkbox
              onCheckedChange={(checked) =>
                onCheckedChange("property-type", t.slug, checked)
              }
              checked={query["property-type"].includes(t.slug)}
              key={t.slug}
              name="property-type[]"
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
