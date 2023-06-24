import React from "react";
import FilterPopover from "../FilterPopover";
import ToggleGroup from "../ToggleGroup";
import css from "./TypeFilterPopover.module.css";
import Checkbox from "../../Elements/Checkbox";

type Props = {};

const TypeFilterPopover = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <FilterPopover label="Type">
        <div className={css["content"]}>
          <div className={css["rent-or-sale"]}>
            <ToggleGroup
              items={[
                { label: "Rent", value: "rent" },
                { label: "Sale", value: "sale" }
              ]}
            />
          </div>
          <div className={css["divider"]} />
          <div className={css['types']}>
            <Checkbox id="apartment" label="Apartment" />
            <Checkbox id="condo" label="Condo" />
          </div>
        </div>
      </FilterPopover>
    </div>
  );
};

export default TypeFilterPopover;
