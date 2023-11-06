import React from "react";
import css from "./BathroomsFilter.module.css";
import ToggleGroup from "../ToggleGroup";
import { RealEstateQuery } from "@rems/types";

type Props = {
  value: RealEstateQuery["space"]["minBedrooms"];
  onChange: (min: RealEstateQuery["space"]["maxBedrooms"]) => void;
};

const BathroomsFilter = ({ value, onChange }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["toggle-group"]}>
        <ToggleGroup
          width={54}
          value={`${value}`}
          onValueChange={(val) => {
            val === "" ? onChange(0) : onChange(parseInt(val, 10));
          }}
          items={[
            { value: "0", label: "Any" },
            { value: "1", label: "1+" },
            { value: "2", label: "2+" },
            { value: "3", label: "3+" },
            { value: "4", label: "4+" },
            { value: "5", label: "5+" }
          ]}
        />
      </div>
    </div>
  );
};

export default BathroomsFilter;
