import React from "react";
import css from "./NearestBTSStationFilter.module.css";
import Select from "../../Elements/Select";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";

type Props = {};

const NearestBTSStationFilter = ({}: Props) => {
  const { btsStations } = useFilters();
  const { query, onValueChange } = useRealEstateQuery();

  return (
    <Select
      value={`${
        query["nearest-bts-station"] ? query["nearest-bts-station"] : ""
      }`}
      options={[
        { label: "Any", value: "" },
        ...btsStations.map((l) => ({
          value: `${l.slug}`,
          label: l.name
        }))
      ]}
      onChange={(e) =>
        onValueChange(
          "nearest-bts-station",
          e.currentTarget.value ? e.currentTarget.value : null
        )
      }
    />
  );
};

export default NearestBTSStationFilter;
