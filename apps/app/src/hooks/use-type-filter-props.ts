import { TypeFilters } from "@rems/ui";
import useRealEstateQuery from "./use-real-estate-query";

const useTypeFilterProps = (): Omit<
  React.ComponentProps<typeof TypeFilters>,
  "id" | "types"
> => {
  const { onCheckedChange, query } = useRealEstateQuery();
  return {
    onChange: (value, checked) =>
      onCheckedChange("property-type", value, checked),
    isChecked: (value) => query["property-type"].includes(value)
  };
};

export default useTypeFilterProps;
