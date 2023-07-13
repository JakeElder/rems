import React from "react";
import FilterPopover from "../FilterPopover";
import css from "./AvailabilityFilterPopover.module.css";
import AvailabilityFilter from "../AvailabilityFilter";

type Props = { on: boolean };

const AvailabilityFilterPopover = ({ on }: Props) => {
  return (
    <div className={css["root"]}>
      <FilterPopover label="Availability" on={on}>
        <div className={css["content"]}>
          <AvailabilityFilter type="toggle" />
        </div>
      </FilterPopover>
    </div>
  );
};

export default AvailabilityFilterPopover;
