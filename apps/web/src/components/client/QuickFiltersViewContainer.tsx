"use client";

import { useActiveQuickFilters, useDispatch } from "@/state";
import { commitRealEstateQuery, setArray } from "@rems/state/app/actions";
import { QuickFilters } from "@rems/ui";
import { useCallback } from "react";

type ViewProps = React.ComponentProps<typeof QuickFilters>;
type Props = Pick<ViewProps, "filters">;

const QuickFiltersViewContainer = ({ filters }: Props) => {
  const active = useActiveQuickFilters();
  const dispatch = useDispatch();

  const isOn: ViewProps["isOn"] = useCallback(
    (key, slug) => active[key].findIndex((f) => f.slug === slug) > -1,
    [active]
  );

  const onChange: ViewProps["onChange"] = useCallback(
    ({ key, filter }, on) => {
      dispatch(
        setArray({
          prop: key,
          role: "USER",
          group: key,
          data: on
            ? [...active[key], filter]
            : [...active[key]].filter((f) => f.id !== filter.id)
        })
      );
      dispatch(commitRealEstateQuery());
    },
    [active]
  );

  return <QuickFilters filters={filters} isOn={isOn} onChange={onChange} />;
};

export default QuickFiltersViewContainer;
