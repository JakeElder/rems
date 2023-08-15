// @ts-nocheck

import React from "react";
import css from "./AreaFilter.module.css";
import Select from "../../Elements/Select";
import { Area, RealEstateQuery } from "@rems/types";

type Props = {
  areas: Area[];
  value: RealEstateQuery["area"];
  onChange: (value: RealEstateQuery["area"]) => void;
};

const AreaFilter = ({ value, areas, onChange }: Props) => {
  return (
    <Select
      value={`${value ? value : ""}`}
      options={[
        { label: "Any", value: "" },
        ...areas.map((l) => ({
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

export default AreaFilter;
