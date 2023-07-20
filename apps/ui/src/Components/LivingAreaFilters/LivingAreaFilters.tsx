import React from "react";
import css from "./LivingAreaFilters.module.css";
import Split from "../../Elements/Split";
import Select from "../../Elements/Select";
import { LivingAreaSize, RealEstateQuery } from "@rems/types";

type Props = {
  minLivingAreaSizes: LivingAreaSize[];
  maxLivingAreaSizes: LivingAreaSize[];
  minLivingArea: RealEstateQuery["min-living-area"];
  maxLivingArea: RealEstateQuery["max-living-area"];
  onMinLivingAreaChange: (value: RealEstateQuery["min-living-area"]) => void;
  onMaxLivingAreaChange: (value: RealEstateQuery["max-living-area"]) => void;
};

const LivingAreaFilters = ({
  minLivingAreaSizes,
  maxLivingAreaSizes,
  minLivingArea,
  maxLivingArea,
  onMinLivingAreaChange,
  onMaxLivingAreaChange
}: Props) => {
  return (
    <Split>
      <Select
        value={`${minLivingArea}`}
        options={minLivingAreaSizes.map((l) => ({
          value: `${l.value}`,
          label: l.label
        }))}
        onChange={(e) =>
          onMinLivingAreaChange(parseInt(e.currentTarget.value, 10))
        }
      />
      <Select
        value={`${maxLivingArea ? maxLivingArea : 0}`}
        options={maxLivingAreaSizes.map((l) => ({
          value: `${l.value}`,
          label: l.label
        }))}
        onChange={(e) => {
          const num = parseInt(e.currentTarget.value, 10);
          onMaxLivingAreaChange(num === 0 ? null : num);
        }}
      />
    </Split>
  );
};

export default LivingAreaFilters;
