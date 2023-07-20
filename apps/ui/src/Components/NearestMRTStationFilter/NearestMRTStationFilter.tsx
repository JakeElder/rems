import React from "react";
import css from "./NearestMRTStationFilter.module.css";
import Select from "../../Elements/Select";
import { MRTStation, RealEstateQuery } from "@rems/types";

type Props = {
  stations: MRTStation[];
  value: RealEstateQuery["nearest-mrt-station"];
  onChange: (value: RealEstateQuery["nearest-mrt-station"]) => void;
};

const NearestMRTStationFilter = ({ value, stations, onChange }: Props) => {
  return (
    <Select
      value={`${value ? value : ""}`}
      options={[
        { label: "Any", value: "" },
        ...stations.map((l) => ({
          value: `${l.slug}`,
          label: l.name
        }))
      ]}
      onChange={(e) =>
        onChange(e.currentTarget.value ? e.currentTarget.value : null)
      }
    />
  );
};

export default NearestMRTStationFilter;
