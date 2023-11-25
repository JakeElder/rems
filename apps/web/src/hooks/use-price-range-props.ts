import { PriceRange } from "@rems/ui";
import { useDispatch, useStagedRealEstateQuery } from "@/state";
import {
  MAX_PURCHASE_PRICE,
  MAX_RENTAL_PRICE,
  MIN_PURCHASE_PRICE,
  MIN_RENTAL_PRICE
} from "../constants";
import { useCallback } from "react";
import {
  commitRealEstateQuery,
  setBudgetAndAvailability
} from "@rems/state/app/actions";

type ViewProps = React.ComponentProps<typeof PriceRange>;

const usePriceRangeProps = (): ViewProps => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  const onChange: ViewProps["onChange"] = useCallback((minPrice, maxPrice) => {
    dispatch(
      setBudgetAndAvailability({
        role: "USER",
        data: { minPrice, maxPrice }
      })
    );
    dispatch(commitRealEstateQuery());
  }, []);

  const { type, minPrice, maxPrice } = stagedQuery.budgetAndAvailability;

  return {
    availability: type,
    onChange,
    maxPrice,
    minPrice,
    minRentalPrice: MIN_RENTAL_PRICE,
    maxRentalPrice: MAX_RENTAL_PRICE,
    minPurchasePrice: MIN_PURCHASE_PRICE,
    maxPurchasePrice: MAX_PURCHASE_PRICE
  };
};

export default usePriceRangeProps;
