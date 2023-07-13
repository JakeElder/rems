import React from "react";
import css from "./AvailabilityFilter.module.css";
import { useRealEstateQuery } from "../RealEstateQueryController";
import Select from "../../Elements/Select";
import ToggleGroup from "../ToggleGroup";

type Props = {
  type?: "toggle" | "select";
};

const AvailabilityFilter = ({ type = "select" }: Props) => {
  const { query, onAvailabilityChange } = useRealEstateQuery();

  if (type === "toggle") {
    return (
      <div className={css["root"]}>
        <ToggleGroup
          width={80}
          value={query["availability"]}
          onValueChange={(val) => {
            onAvailabilityChange(val as "sale" | "rent");
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
        value={query["availability"]}
        onChange={(e) => {
          onAvailabilityChange(e.currentTarget.value as "sale" | "rent");
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
