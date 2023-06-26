import React from "react";
import FilterPopover from "../FilterPopover";
import css from "./BedsFilterPopover.module.css";
import BedsFilter from "../BedsFilter/BedsFilter";

type Props = {};

const BedsFilterPopover = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <FilterPopover label="Beds">
        <div className={css["content"]}>
          <BedsFilter />
        </div>
      </FilterPopover>
    </div>
  );
};

export default BedsFilterPopover;
