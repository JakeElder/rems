import React, { useState } from "react";
import css from "./PriceRange.module.css";
import Slider from "../../Elements/Slider";

type Props = {};

const MIN = 0;
const MAX = 100_000_000;
const STEP = 1000

const PriceRange = ({}: Props) => {
  const [value, setValue] = useState([MIN, MAX]);
  const formatted = [
    `฿ ${value[0].toLocaleString()}`,
    `฿ ${value[1].toLocaleString()}`
  ];
  return (
    <div className={css["root"]}>
      <div className={css["slider"]}>
        <Slider
          min={MIN}
          max={MAX}
          step={STEP}
          value={value}
          onValueChange={setValue}
        />
      </div>
      <div className={css["inputs"]}>
        <input value={formatted[0]} readOnly />
        <input value={formatted[1]} readOnly />
      </div>
    </div>
  );
};

export default PriceRange;
