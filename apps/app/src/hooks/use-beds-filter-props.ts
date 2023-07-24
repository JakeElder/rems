import { BedsFilter } from "@rems/ui";
import useRealEstateQuery from "./use-real-estate-query";

const useBedsFilterProps = (): React.ComponentProps<typeof BedsFilter> => {
  const { query, onMinBedsChange, onMaxBedsChange } = useRealEstateQuery();

  return {
    maxBedrooms: query["max-bedrooms"],
    minBedrooms: query["min-bedrooms"],
    onMinChange: onMinBedsChange,
    onMaxChange: onMaxBedsChange
  };
};

export default useBedsFilterProps;
