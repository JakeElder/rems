import React from "react";
import FilterPopover from "../FilterPopover";
import css from "./PriceFilterPopover.module.css";
import PriceRange from "../PriceRange/PriceRange";

type Props = { on?: boolean };

const PriceFilterPopover = ({ on }: Props) => {
  return (
    <div className={css["root"]}>
      <FilterPopover label="Price" on={on}>
        <div className={css["content"]}>
          <PriceRange />
        </div>
      </FilterPopover>
    </div>
  );
};

export default PriceFilterPopover;
