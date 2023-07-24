import React from "react";
import css from "./LotSizeFilters.module.css";
import Split from "../../Elements/Split";
import Select from "../../Elements/Select";
import { LotSize, RealEstateQuery } from "@rems/types";

type Props = {
  minLotSizes: LotSize[];
  maxLotSizes: LotSize[];
  minLotSize: RealEstateQuery["min-lot-size"];
  maxLotSize: RealEstateQuery["max-lot-size"];
  onMinLotSizeChange: (value: RealEstateQuery["min-lot-size"]) => void;
  onMaxLotSizeChange: (value: RealEstateQuery["max-lot-size"]) => void;
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
