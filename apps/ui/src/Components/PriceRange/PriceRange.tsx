"use client";

import React, { useEffect, useState } from "react";
import css from "./PriceRange.module.css";
import Slider from "../../Elements/Slider";
import { RealEstateQuery } from "@rems/types";

type Props = {
  availability: RealEstateQuery["availability"];
  minPurchasePrice: number;
  maxPurchasePrice: number;
  minRentalPrice: number;
  maxRentalPrice: number;
  minPrice: RealEstateQuery["min-price"];
  maxPrice: RealEstateQuery["max-price"];
  onChange: (
    min: RealEstateQuery["min-price"],
    max: RealEstateQuery["max-price"]
  ) => void;
};

const PriceRange = ({
  availability,
  minPurchasePrice,
  maxPurchasePrice,
  minRentalPrice,
  maxRentalPrice,
  minPrice,
  maxPrice,
  onChange
}: Props) => {
  const MIN = availability === "sale" ? minPurchasePrice : minRentalPrice;
  const MAX = availability === "sale" ? maxPurchasePrice : maxRentalPrice;
  const STEP = availability === "sale" ? 1000 : 100;

  const [value, setValue] = useState([minPrice, maxPrice ? maxPrice : MAX]);

  useEffect(() => {
    setValue([minPrice, maxPrice ? maxPrice : MAX]);
  }, [minPrice, maxPrice, availability]);

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
          onValueCommit={([min, max]) =>
            onChange(min, max === MAX ? null : max)
          }
          name="price-range"
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
