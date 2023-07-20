import React from "react";
import FilterPopover from "../FilterPopover";
import css from "./BedsFilterPopover.module.css";
import BedsFilter from "../BedsFilter/BedsFilter";

type Props = React.ComponentProps<typeof BedsFilter> & {
  on: boolean;
};

const BedsFilterPopover = ({ on, ...props }: Props) => {
  return (
    <div className={css["root"]}>
      <FilterPopover label="Beds" on={on}>
        <div className={css["content"]}>
          <BedsFilter {...props} />
        </div>
      </FilterPopover>
    </div>
  );
};

export default BedsFilterPopover;
