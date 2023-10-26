import React from "react";
import Split from "../../Elements/Split";
import Select from "../../Elements/Select";
import { LotSize, RealEstateQuery } from "@rems/types";

type Props = {
  minLotSizes: LotSize[];
  maxLotSizes: LotSize[];
  minLotSize: RealEstateQuery["space"]["minLotSize"];
  maxLotSize: RealEstateQuery["space"]["maxLotSize"];
  onMinLotSizeChange: (value: RealEstateQuery["space"]["minLotSize"]) => void;
  onMaxLotSizeChange: (value: RealEstateQuery["space"]["maxLotSize"]) => void;
};

const LotSizeFilters = ({
  minLotSize,
  maxLotSizes,
  maxLotSize,
  minLotSizes,
  onMinLotSizeChange,
  onMaxLotSizeChange
}: Props) => {
  return (
    <Split>
      <Select
        value={`${minLotSize}`}
        options={minLotSizes.map((l) => ({
          value: `${l.value}`,
          label: l.label
        }))}
        onChange={(e) =>
          onMinLotSizeChange(parseInt(e.currentTarget.value, 10))
        }
      />
      <Select
        value={`${maxLotSize ? maxLotSize : 0}`}
        options={maxLotSizes.map((l) => ({
          value: `${l.value}`,
          label: l.label
        }))}
        onChange={(e) => {
          const num = parseInt(e.currentTarget.value, 10);
          onMaxLotSizeChange(num === 0 ? null : num);
        }}
      />
    </Split>
  );
};

export default LotSizeFilters;
