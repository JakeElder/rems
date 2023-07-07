import React from "react";
import css from "./NearestMRTStationFilter.module.css";
import Select from "../../Elements/Select";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";

type Props = {};

const NearestMRTStationFilter = ({}: Props) => {
  const { mrtStations } = useFilters();
  const { query, onValueChange } = useRealEstateQuery();

  return (
    <Select
      value={`${
        query["nearest-mrt-station"] ? query["nearest-mrt-station"] : ""
      }`}
      options={[
        { label: "Any", value: "" },
        ...mrtStations.map((l) => ({
          value: `${l.slug}`,
          label: l.name
        }))
      ]}
      onChange={(e) =>
        onValueChange(
          "nearest-mrt-station",
          e.currentTarget.value ? e.currentTarget.value : null
        )
      }
    />
  );
};

export default NearestMRTStationFilter;
