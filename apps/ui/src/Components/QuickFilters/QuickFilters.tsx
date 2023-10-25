import React from "react";
import Toggle from "../../Elements/Toggle";
import { QuickFilter, QuickFilterQueryKey } from "@rems/types";

type Props = {
  filters: QuickFilter[];
  isOn: (key: QuickFilterQueryKey, value: string) => boolean;
  onChange: (quickFilter: QuickFilter, on: boolean) => void;
};

const QuickFilters = ({ filters, onChange, isOn }: Props) => {
  return (
    <>
      {filters.map((f) => {
        const key = f.key;
        const value = f.filter.slug;
        const on = isOn(key, value);

        return (
          <Toggle
            key={`${key}.${f.filter.slug}`}
            pressed={on}
            onPressedChange={(on) => onChange(f, on)}
          >
            {f.filter.name}
          </Toggle>
        );
      })}
    </>
  );
};

export default QuickFilters;
