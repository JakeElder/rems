import React from "react";
import FilterPopover from "../FilterPopover";
import css from "./PriceFilterPopover.module.css";
import PriceRange from "../PriceRange";

type Props = React.ComponentProps<typeof PriceRange> & {
  on: boolean;
};

const PriceFilterPopover = ({ on, ...props }: Props) => {
  return (
    <div className={css["root"]}>
      <FilterPopover label="Price" on={on}>
        <div className={css["content"]}>
          <PriceRange {...props} />
        </div>
      </FilterPopover>
    </div>
  );
};

export default PriceFilterPopover;
