import React from "react";
import css from "./BathroomsFilter.module.css";
import ToggleGroup from "../ToggleGroup";
import { useRealEstateQuery } from "../RealEstateQueryController";

type Props = {};

const BathroomsFilter = ({}: Props) => {
  const { query, onMinBathsChange } = useRealEstateQuery();
  const value = query["min-bathrooms"];

  return (
    <div className={css["root"]}>
      <div className={css["toggle-group"]}>
        <ToggleGroup
          width={54}
          value={`${value}`}
          onValueChange={(val) => {
            onMinBathsChange(parseInt(val, 10));
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
