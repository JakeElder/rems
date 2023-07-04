import React from "react";
import FilterPopover from "../FilterPopover";
import css from "./TypeFilterPopover.module.css";
import TypeFilters from "../TypeFilters/TypeFilters";

type Props = {};

const TypeFilterPopover = ({ }: Props) => {
  return (
    <div className={css["root"]}>
      <FilterPopover label="Type">
        <div className={css["content"]}>
          <TypeFilters id="bar" />
        </div>
      </FilterPopover>
    </div>
  );
};

export default TypeFilterPopover;
