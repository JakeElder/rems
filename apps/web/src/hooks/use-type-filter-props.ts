import {
  commitRealEstateQuery,
  setArray,
  useActivePropertyTypeFilters,
  useDispatch
} from "@/state";
import { TypeFilters } from "@rems/ui";
import { useCallback } from "react";

type ViewProps = React.ComponentProps<typeof TypeFilters>;
type Return = Pick<ViewProps, "onChange" | "isChecked">;

const useTypeFilterProps = (): Return => {
  const dispatch = useDispatch();
  const active = useActivePropertyTypeFilters();

  const isChecked: ViewProps["isChecked"] = useCallback(
    (filter) => active.findIndex((f) => f.slug === filter.slug) > -1,
    [active]
  );

  const onChange: ViewProps["onChange"] = useCallback(
    (filter, on) => {
      dispatch(
        setArray({
          role: "USER",
          prop: "propertyTypes",
          group: "Property Types",
          data: on
            ? [...active, filter]
            : [...active].filter((f) => f.id !== filter.id)
        })
      );
      dispatch(commitRealEstateQuery());
    },
    [active]
  );

  return {
    onChange,
    isChecked
  };
};

export default useTypeFilterProps;
