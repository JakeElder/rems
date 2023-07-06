import React from "react";
import css from "./ViewTypeFilters.module.css";
import Checkbox from "../../Elements/Checkbox";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";
import CheckboxGrid from "../CheckboxGrid";

type Props = {};

const ViewTypeFilters = ({}: Props) => {
  const { viewTypes } = useFilters();
  const { query, onCheckedChange } = useRealEstateQuery();

  return (
    <div className={css["root"]}>
      <div className={css["types"]}>
        <CheckboxGrid
          items={viewTypes.map((t) => (
            <Checkbox
              onCheckedChange={(checked) =>
                onCheckedChange("view-type", t.slug, checked)
              }
              checked={query["view-type"].includes(t.slug)}
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
