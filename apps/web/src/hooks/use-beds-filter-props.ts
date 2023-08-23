import { BedsFilter } from "@rems/ui";
import useRealEstateQuery from "./use-real-estate-query";

const useBedsFilterProps = (): React.ComponentProps<typeof BedsFilter> => {
  const { stagedQuery, onMinBedsChange, onMaxBedsChange } =
    useRealEstateQuery();

  return {
    maxBedrooms: stagedQuery["max-bedrooms"],
    minBedrooms: stagedQuery["min-bedrooms"],
    onMinChange: onMinBedsChange,
    onMaxChange: onMaxBedsChange
  };
};

export default useBedsFilterProps;
