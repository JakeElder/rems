"use client";

import React, { MutableRefObject, useRef } from "react";
import css from "./FilterBar.module.css";
import Container from "../../Elements/Container/Container";
import { useDraggable } from "react-use-draggable-scroll";
import TypeFilterPopover from "../TypeFilterPopover";
import PriceFilterPopover from "../PriceFilterPopover";
import BedsFilterPopover from "../BedsFilterPopover";
import FilterDialog from "../FilterDialog";
import QuickFilters from "../QuickFilters";

type Props = {};

const FilterBar = ({}: Props) => {
  const $sections = useRef<HTMLDivElement>(null);
  const { events } = useDraggable(
    $sections as MutableRefObject<HTMLDivElement>
  );

  return (
    <div className={css["root"]} ref={$sections} {...events}>
      <Container full>
        <div className={css["sections"]}>
          <div className={css["filters"]}>
            <FilterDialog />
          </div>
          <div className={css["separator"]} />
          <div className={css["key-filters"]}>
            <TypeFilterPopover />
            <PriceFilterPopover />
            <BedsFilterPopover />
          </div>
          <div className={css["separator"]} />
          <div className={css["toggles"]}>
            <QuickFilters />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FilterBar;
