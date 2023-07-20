import { TypeFilters } from "@rems/ui";
import useRealEstateQuery from "./use-real-estate-query";

const useTypeFilterProps = (): Omit<
  React.ComponentProps<typeof TypeFilters>,
  "id" | "types"
> => {
  const { onCheckedChange, query } = useRealEstateQuery();
  return {
    onChange: (value, checked) => onCheckedChange("view-types", value, checked),
    isChecked: (value) => query["view-types"].includes(value)
  };
};

export default useTypeFilterProps;
