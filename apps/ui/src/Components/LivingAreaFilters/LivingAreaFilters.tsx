import React from "react";
import css from "./LivingAreaFilters.module.css";
import Split from "../../Elements/Split";
import Select from "../../Elements/Select";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";

type Props = {};

const LivingAreaFilters = ({}: Props) => {
  const { livingAreaSizes } = useFilters();
  const { query, onValueChange } = useRealEstateQuery();

  return (
    <Split>
      <Select
        value={`${query["min-living-area"]}`}
        options={livingAreaSizes.min.map((l) => ({
          value: `${l.value}`,
          label: l.label
        }))}
        onChange={(e) =>
          onValueChange("min-living-area", parseInt(e.currentTarget.value, 10))
        }
      />
      <Select
        value={`${query["max-living-area"] ? query["max-living-area"] : 0}`}
        options={livingAreaSizes.max.map((l) => ({
          value: `${l.value}`,
          label: l.label
        }))}
        onChange={(e) => {
          const num = parseInt(e.currentTarget.value, 10);
          onValueChange("max-living-area", num === 0 ? null : num);
        }}
      />
    </Split>
  );
};

export default LivingAreaFilters;
