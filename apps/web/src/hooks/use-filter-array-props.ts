import { commitRealEstateQuery, setArray, useDispatch } from "@/state";
import { Filter, RealEstateQueryArrayKey } from "@rems/types";
import { TypeFilters } from "@rems/ui";
import { useCallback } from "react";

type ViewProps = React.ComponentProps<typeof TypeFilters>;
type Return = Pick<ViewProps, "onChange" | "isChecked">;

const useFilterArrayProps = (
  arr: RealEstateQueryArrayKey,
  active: Filter[]
): Return => {
  const dispatch = useDispatch();

  const isChecked: ViewProps["isChecked"] = useCallback(
    (filter) => active.findIndex((f) => f.slug === filter.slug) > -1,
    [active]
  );

  const onChange: ViewProps["onChange"] = useCallback(
    (filter, on) => {
      dispatch(
        setArray({
          role: "USER",
          prop: arr,
          group: arr,
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

export default useFilterArrayProps;
