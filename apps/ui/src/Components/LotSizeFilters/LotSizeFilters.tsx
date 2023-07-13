import React from "react";
import css from "./LotSizeFilters.module.css";
import Split from "../../Elements/Split";
import Select from "../../Elements/Select";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";

type Props = {};

const LotSizeFilters = ({}: Props) => {
  const { lotSizes } = useFilters();
  const { query, onValueChange } = useRealEstateQuery();

  return (
    <Split>
      <Select
        value={`${query["min-lot-size"]}`}
        options={lotSizes.min.map((l) => ({
          value: `${l.value}`,
          label: l.label
        }))}
        onChange={(e) =>
          onValueChange("min-lot-size", parseInt(e.currentTarget.value, 10))
        }
      />
      <Select
        value={`${query["max-lot-size"] ? query["max-lot-size"] : 0}`}
        options={lotSizes.max.map((l) => ({
          value: `${l.value}`,
          label: l.label
        }))}
        onChange={(e) => {
          const num = parseInt(e.currentTarget.value, 10);
          onValueChange("max-lot-size", num === 0 ? null : num);
        }}
      />
    </Split>
  );
};

export default LotSizeFilters;
