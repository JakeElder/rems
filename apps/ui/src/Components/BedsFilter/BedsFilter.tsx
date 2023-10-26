import React from "react";
import css from "./BedsFilter.module.css";
import ToggleGroup from "../ToggleGroup";
import Checkbox from "../../Elements/Checkbox";
import { RealEstateQuery } from "@rems/types";

type Props = {
  minBedrooms: RealEstateQuery["space"]["minBedrooms"];
  maxBedrooms: RealEstateQuery["space"]["maxBedrooms"];
  onMinChange: (value: RealEstateQuery["space"]["minBedrooms"]) => void;
  onMaxChange: (value: RealEstateQuery["space"]["maxBedrooms"]) => void;
};

const label = (n: number, exact: boolean) => (exact ? `${n}` : `${n}+`);

const BedsFilter = ({
  minBedrooms,
  maxBedrooms,
  onMinChange,
  onMaxChange
}: Props) => {
  const min = minBedrooms;
  const max = maxBedrooms;
  const exact = max !== null;

  return (
    <div className={css["root"]}>
      <div className={css["toggle-group"]}>
        <ToggleGroup
          width={54}
          value={`${min}`}
          onValueChange={(val) => {
            if (val === "") {
              onMinChange(0);
              return;
            }
            onMinChange(parseInt(val, 10));
          }}
          items={[
            { value: "0", label: "Any" },
            { value: "1", label: label(1, exact) },
            { value: "2", label: label(2, exact) },
            { value: "3", label: label(3, exact) },
            { value: "4", label: label(4, exact) },
            { value: "5", label: label(5, exact) }
          ]}
        />
      </div>
      <Checkbox
        id="exact"
        label="Use exact match"
        checked={exact}
        disabled={min === 0}
        onCheckedChange={(checked) => {
          onMaxChange(checked ? min : null);
        }}
      />
    </div>
  );
};

export default BedsFilter;
