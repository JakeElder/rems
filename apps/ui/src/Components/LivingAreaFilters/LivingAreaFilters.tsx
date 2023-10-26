import React from "react";
import Split from "../../Elements/Split";
import Select from "../../Elements/Select";
import { LivingAreaSize, RealEstateQuery } from "@rems/types";

type Props = {
  minLivingAreaSizes: LivingAreaSize[];
  maxLivingAreaSizes: LivingAreaSize[];
  minLivingArea: RealEstateQuery["space"]["minLivingArea"];
  maxLivingArea: RealEstateQuery["space"]["maxLivingArea"];
  onMinLivingAreaChange: (
    value: RealEstateQuery["space"]["minLivingArea"]
  ) => void;
  onMaxLivingAreaChange: (
    value: RealEstateQuery["space"]["maxLivingArea"]
  ) => void;
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
