import React, { useState } from "react";
import FilterPopover from "../FilterPopover";
import css from "./BedsFilterPopover.module.css";
import ToggleGroup from "../ToggleGroup/ToggleGroup";
import Checkbox from "../../Elements/Checkbox";

type Props = {};

const label = (n: number, exact: boolean) => (exact ? `${n}` : `${n}+`);

const BedsFilterPopover = ({}: Props) => {
  const [exact, setExact] = useState(false);

  return (
    <div className={css["root"]}>
      <FilterPopover label="Beds">
        <div className={css["content"]}>
          <div className={css["toggle-group"]}>
            <ToggleGroup
              width={44}
              defaultValue="any"
              items={[
                { value: "any", label: "Any" },
                { value: "1", label: label(1, exact) },
                { value: "2", label: label(2, exact) },
                { value: "3", label: label(3, exact) },
                { value: "4", label: label(4, exact) },
                { value: "5", label: label(5, exact) }
              ]}
            />
          </div>
          <div className={css["divider"]} />
          <Checkbox
            id="exact"
            label="Use exact match"
            checked={exact}
            onCheckedChange={(checked) => setExact(!!checked)}
          />
        </div>
      </FilterPopover>
    </div>
  );
};

export default BedsFilterPopover;
