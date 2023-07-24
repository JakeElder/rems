import React from "react";
import css from "./AvailabilityFilter.module.css";
import Select from "../../Elements/Select";
import ToggleGroup from "../ToggleGroup";
import { RealEstateQuery } from "@rems/types";

type Props = {
  type?: "toggle" | "select";
  value: RealEstateQuery["availability"];
  onChange: (availability: RealEstateQuery["availability"]) => void;
};

const AvailabilityFilter = ({ type = "select", onChange, value }: Props) => {
  if (type === "toggle") {
    return (
      <div className={css["root"]}>
        <ToggleGroup
          width={80}
          value={value}
          onValueChange={(val) => {
            if (val === "sale" || val === "rent") {
              onChange(val);
            }
          }}
          items={[
            { value: "sale", label: "Sale" },
            { value: "rent", label: "Rent" }
          ]}
        />
      </div>
    );
  }

  return (
    <div className={css["root"]}>
      <Select
        value={value}
        onChange={(e) => {
          const val = e.currentTarget.value;
          if (val === "sale" || val === "rent") {
            onChange(val);
          }
        }}
        options={[
          { value: "sale", label: "Sale" },
          { value: "rent", label: "Rent" }
        ]}
      />
    </div>
  );
};

export default AvailabilityFilter;
