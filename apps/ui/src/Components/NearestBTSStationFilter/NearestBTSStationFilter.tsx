import React from "react";
import css from "./NearestBTSStationFilter.module.css";
import Select from "../../Elements/Select";
import { BTSStation, RealEstateQuery } from "@rems/types";

type Props = {
  stations: BTSStation[];
  value: RealEstateQuery["nearest-bts-station"];
  onChange: (value: RealEstateQuery["nearest-bts-station"]) => void;
};

const NearestBTSStationFilter = ({ stations, value, onChange }: Props) => {
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

export default NearestBTSStationFilter;
