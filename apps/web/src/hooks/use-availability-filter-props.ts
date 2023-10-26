import {
  commitRealEstateQuery,
  setBudgetAndAvailability,
  useActivePropertyTypeFilters,
  useDispatch
} from "@/state";
import { AvailabilityFilter } from "@rems/ui";
import { useCallback } from "react";

type ViewProps = React.ComponentProps<typeof AvailabilityFilter>;
type Return = Pick<ViewProps, "onChange">;

const useAvailabilityFilterProps = (): Return => {
  const dispatch = useDispatch();
  const active = useActivePropertyTypeFilters();

  const onChange: ViewProps["onChange"] = useCallback(
    (type) => {
      dispatch(setBudgetAndAvailability({ role: "USER", data: { type } }));
      dispatch(commitRealEstateQuery());
    },
    [active]
  );

  return {
    onChange
  };
};

export default useAvailabilityFilterProps;
