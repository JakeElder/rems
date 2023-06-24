import React from "react";
import FilterPopover from "../FilterPopover";
import css from "./TypeFilterPopover.module.css";

type Props = {};

const TypeFilterPopover = ({}: Props) => {
  return (
    <FilterPopover label="Type">
      <span></span>
    </FilterPopover>
  );
};

export default TypeFilterPopover;
