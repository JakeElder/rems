import React from "react";
import Toggle from "../../Elements/Toggle";
import {
  QuickFilter,
  QuickFilterQueryKey,
  QuickFilterType,
  RealEstateQuery
} from "@rems/types";

type Props = {
  filters: QuickFilter[];
  isOn: (key: QuickFilterQueryKey, value: string) => boolean;
  onChange?: (key: keyof RealEstateQuery, value: string, on: boolean) => void;
};

const mapTypeToQueryKey = (type: QuickFilterType): QuickFilterQueryKey => {
  const map: Record<QuickFilterType, QuickFilterQueryKey> = {
    INDOOR_FEATURE: "indoor-features",
    VIEW_TYPE: "view-types",
    LOT_FEATURE: "lot-features",
    OUTDOOR_FEATURE: "outdoor-features"
  };

  return map[type];
};

const QuickFilters = ({ filters, onChange, isOn }: Props) => {
  return (
    <>
      {filters.map((f) => {
        const key = mapTypeToQueryKey(f.type);
        const value = f.filter.slug;
        const on = isOn(key, value);

        return (
          <Toggle
            key={`${key}.${f.filter.slug}`}
            pressed={on}
            onPressedChange={(pressed) => {
              onChange?.(key, f.filter.slug, pressed);
            }}
          >
            {f.filter.name}
          </Toggle>
        );
      })}
    </>
  );
};

export default QuickFilters;
