import React from "react";
import css from "./BathroomsFilter.module.css";
import ToggleGroup from "../ToggleGroup";

type Props = {};

const BathroomsFilter = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["toggle-group"]}>
        <ToggleGroup
          width={44}
          defaultValue="any"
          items={[
            { value: "any", label: "Any" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" }
          ]}
        />
      </div>
    </div>
  );
};

export default BathroomsFilter;
