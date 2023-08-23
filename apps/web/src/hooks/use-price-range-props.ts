import { PriceRange } from "@rems/ui";
import useRealEstateQuery from "./use-real-estate-query";
import {
  MAX_PURCHASE_PRICE,
  MAX_RENTAL_PRICE,
  MIN_PURCHASE_PRICE,
  MIN_RENTAL_PRICE
} from "../constants";

const usePriceRangeProps = (): React.ComponentProps<typeof PriceRange> => {
  const { stagedQuery, onPriceRangeChange } = useRealEstateQuery();

  return {
    availability: stagedQuery["availability"],
    onChange: onPriceRangeChange,
    maxPrice: stagedQuery["max-price"],
    minPrice: stagedQuery["min-price"],
    minRentalPrice: MIN_RENTAL_PRICE,
    maxRentalPrice: MAX_RENTAL_PRICE,
    minPurchasePrice: MIN_PURCHASE_PRICE,
    maxPurchasePrice: MAX_PURCHASE_PRICE
  };
};

export default usePriceRangeProps;
