"use client";

import React from "react";
import css from "./SearchRadius.module.css";
import Slider from "../../Elements/Slider";
import Checkbox from "../../Elements/Checkbox";

type Props = Omit<React.ComponentProps<typeof Slider>, "value"> & {
  enabled: boolean;
  onEnabledChange: (active: boolean) => void;
  value: number;
};

const SearchRadius = ({ value, enabled, onEnabledChange, ...props }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["slider"]}>
        <Slider {...props} value={[value]} name="search-radius" />
      </div>
      <div className={css["enabled-and-value"]}>
        <div className={css["enabled"]}>
          <Checkbox
            id="exact"
            label="Enable search radius"
            onCheckedChange={(checked) => {
              onEnabledChange(checked !== "indeterminate" && checked);
            }}
          />
        </div>
        <div className={css["value"]}>{value}M²</div>
      </div>
    </div>
  );
};

export default SearchRadius;
