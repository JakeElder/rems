import React from "react";
import FilterPopover from "../FilterPopover";
import css from "./AvailabilityFilterPopover.module.css";
import AvailabilityFilter from "../AvailabilityFilter";

type Props = React.ComponentProps<typeof AvailabilityFilter> & {};

const AvailabilityFilterPopover = (props: Props) => {
  return (
    <div className={css["root"]}>
      <FilterPopover label="Availability">
        <div className={css["content"]}>
          <AvailabilityFilter type="toggle" {...props} />
        </div>
      </FilterPopover>
    </div>
  );
};

export default AvailabilityFilterPopover;
