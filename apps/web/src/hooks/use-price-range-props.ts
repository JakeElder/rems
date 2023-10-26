import { PriceRange } from "@rems/ui";
import {
  commitRealEstateQuery,
  setBudgetAndAvailability,
  useDispatch,
  useStagedRealEstateQuery
} from "@/state";
import {
  MAX_PURCHASE_PRICE,
  MAX_RENTAL_PRICE,
  MIN_PURCHASE_PRICE,
  MIN_RENTAL_PRICE
} from "../constants";

const usePriceRangeProps = (): React.ComponentProps<typeof PriceRange> => {
  const stagedQuery = useStagedRealEstateQuery();
  const dispatch = useDispatch();

  const { type, minPrice, maxPrice } = stagedQuery.budgetAndAvailability;

  return {
    availability: type,
    onChange: (minPrice, maxPrice) => {
      dispatch(
        setBudgetAndAvailability({
          role: "USER",
          data: { minPrice, maxPrice }
        })
      );
      dispatch(commitRealEstateQuery());
    },
    maxPrice,
    minPrice,
    minRentalPrice: MIN_RENTAL_PRICE,
    maxRentalPrice: MAX_RENTAL_PRICE,
    minPurchasePrice: MIN_PURCHASE_PRICE,
    maxPurchasePrice: MAX_PURCHASE_PRICE
  };
};

export default usePriceRangeProps;
