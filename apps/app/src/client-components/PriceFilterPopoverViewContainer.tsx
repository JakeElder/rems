"use client";

import React from "react";
import useRealEstateQuery from "../hooks/use-real-estate-query";
import { PriceFilterPopover } from "@rems/ui";
import {
  MAX_PURCHASE_PRICE,
  MAX_RENTAL_PRICE,
  MIN_PURCHASE_PRICE,
  MIN_RENTAL_PRICE
} from "../constants";

type Props = {};

const PriceFilterPopoverViewContainer = ({}: Props) => {
  const { has, query, onPriceRangeChange } = useRealEstateQuery();
  return (
    <PriceFilterPopover
      on={has("min-price") || has("max-price")}
      availability={query["availability"]}
      onChange={onPriceRangeChange}
      maxPrice={query["max-price"]}
      minPrice={query["min-price"]}
      minRentalPrice={MIN_RENTAL_PRICE}
      maxRentalPrice={MAX_RENTAL_PRICE}
      minPurchasePrice={MIN_PURCHASE_PRICE}
      maxPurchasePrice={MAX_PURCHASE_PRICE}
    />
  );
};

export default PriceFilterPopoverViewContainer;
