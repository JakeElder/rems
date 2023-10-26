import React from "react";
import css from "./AvailabilityFilter.module.css";
import Select from "../../Elements/Select";
import ToggleGroup from "../ToggleGroup";
import { RealEstateQuery } from "@rems/types";

type Props = {
  type?: "toggle" | "select";
  value: RealEstateQuery["budgetAndAvailability"]["type"];
  onChange: (
    availability: RealEstateQuery["budgetAndAvailability"]["type"]
  ) => void;
};

const AvailabilityFilter = ({ type = "select", onChange, value }: Props) => {
  if (type === "toggle") {
    return (
      <div className={css["root"]}>
        <ToggleGroup
          width={80}
          value={value}
          onValueChange={(val) => {
            if (val === "SALE" || val === "RENT") {
              onChange(val);
            }
          }}
          items={[
            { value: "SALE", label: "Sale" },
            { value: "RENT", label: "Rent" }
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
          if (val === "SALE" || val === "RENT") {
            onChange(val);
          }
        }}
        options={[
          { value: "SALE", label: "Sale" },
          { value: "RENT", label: "Rent" }
        ]}
      />
    </div>
  );
};

export default AvailabilityFilter;
