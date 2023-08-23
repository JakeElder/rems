import { TypeFilters } from "@rems/ui";
import useRealEstateQuery from "./use-real-estate-query";

const useTypeFilterProps = (): Omit<
  React.ComponentProps<typeof TypeFilters>,
  "id" | "types"
> => {
  const { onCheckedChange, stagedQuery } = useRealEstateQuery();
  return {
    onChange: (value, checked) =>
      onCheckedChange("property-types", value, checked),
    isChecked: (value) => stagedQuery["property-types"].includes(value)
  };
};

export default useTypeFilterProps;
