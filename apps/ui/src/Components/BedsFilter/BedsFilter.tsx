import React from "react";
import css from "./BedsFilter.module.css";
import ToggleGroup from "../ToggleGroup";
import Checkbox from "../../Elements/Checkbox";
import { useRealEstateQuery } from "../RealEstateQueryController";

type Props = {};

const label = (n: number, exact: boolean) => (exact ? `${n}` : `${n}+`);

const BedsFilter = ({}: Props) => {
  const { query, onMinBedsChange, onMaxBedsChange } = useRealEstateQuery();

  const min = query["min-bedrooms"];
  const max = query["max-bedrooms"];
  const exact = max !== null;

  return (
    <div className={css["root"]}>
      <div className={css["toggle-group"]}>
        <ToggleGroup
          width={54}
          value={`${min}`}
          onValueChange={(val) => {
            if (val === "") {
              onMinBedsChange(0);
              return;
            }
            onMinBedsChange(parseInt(val, 10));
          }}
          items={[
            { value: "0", label: "Any" },
            { value: "1", label: label(1, exact) },
            { value: "2", label: label(2, exact) },
            { value: "3", label: label(3, exact) },
            { value: "4", label: label(4, exact) },
            { value: "5", label: label(5, exact) }
          ]}
        />
      </div>
      <Checkbox
        id="exact"
        label="Use exact match"
        checked={exact}
        disabled={min === 0}
        onCheckedChange={(checked) => {
          onMaxBedsChange(checked ? min : null);
        }}
      />
    </div>
  );
};

export default BedsFilter;
