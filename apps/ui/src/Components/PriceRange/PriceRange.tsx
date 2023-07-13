import React, { useEffect, useState } from "react";
import css from "./PriceRange.module.css";
import Slider from "../../Elements/Slider";
import { useRealEstateQuery } from "../RealEstateQueryController";
import { useFilters } from "../../Utils/FiltersContext";

type Props = {};

const PriceRange = ({}: Props) => {
  const { query, onPriceRangeChange } = useRealEstateQuery();
  const { priceRange } = useFilters();

  const MIN =
    query["availability"] === "sale"
      ? priceRange.minPurchasePrice
      : priceRange.minRentalPrice;

  const MAX =
    query["availability"] === "sale"
      ? priceRange.maxPurchasePrice
      : priceRange.maxRentalPrice;

  const STEP = query["availability"] === "sale" ? 1000 : 100;

  const [value, setValue] = useState([
    query["min-price"],
    query["max-price"] ? query["max-price"] : MAX
  ]);

  useEffect(() => {
    setValue([
      query["min-price"],
      query["max-price"] ? query["max-price"] : MAX
    ]);
  }, [query["min-price"], query["max-price"], query["availability"]]);

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
            onPriceRangeChange(min, max === MAX ? null : max)
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
