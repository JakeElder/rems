import React from "react";
import css from "./AreaFilter.module.css";
import Select from "../../Elements/Select";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";

type Props = {};

const AreaFilter = ({}: Props) => {
  const { areas } = useFilters();
  const { query, onValueChange } = useRealEstateQuery();

  return (
    <Select
      value={`${query["area"] ? query["area"] : ""}`}
      options={[
        { label: "Any", value: "" },
        ...areas.map((l) => ({
          value: `${l.slug}`,
          label: l.name
        }))
      ]}
      onChange={(e) =>
        onValueChange(
          "area",
          e.currentTarget.value ? e.currentTarget.value : null
        )
      }
    />
  );
};

export default AreaFilter;
