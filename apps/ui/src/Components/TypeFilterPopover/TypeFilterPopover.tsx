import React from "react";
import FilterPopover from "../FilterPopover";
import css from "./TypeFilterPopover.module.css";
import TypeFilters from "../TypeFilters/TypeFilters";

type Props = Omit<React.ComponentProps<typeof TypeFilters>, "id"> & {
  on: boolean;
};

const TypeFilterPopover = ({ on, ...props }: Props) => {
  return (
    <div className={css["root"]}>
      <FilterPopover label="Type" on={on}>
        <div className={css["content"]}>
          <TypeFilters id="bar" {...props} />
        </div>
      </FilterPopover>
    </div>
  );
};

export default TypeFilterPopover;
