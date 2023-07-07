import React from "react";
import css from "./QuickFilters.module.css";
import { useFilters } from "../../Utils/FiltersContext";
import { useRealEstateQuery } from "../RealEstateQueryController";
import Toggle from "../../Elements/Toggle";
import { QuickFilterQueryKey, QuickFilterType } from "@rems/types";

type Props = {};

const mapTypeToQueryKey = (type: QuickFilterType): QuickFilterQueryKey => {
  const map: Record<QuickFilterType, QuickFilterQueryKey> = {
    INDOOR_FEATURE: "indoor-features",
    VIEW_TYPE: "view-types",
    LOT_FEATURE: "lot-features",
    OUTDOOR_FEATURE: "outdoor-features"
  };

  return map[type];
};

const QuickFilters = ({}: Props) => {
  const { quickFilters } = useFilters();
  const { query, onCheckedChange } = useRealEstateQuery();

  return (
    <>
      {quickFilters.map((f) => {
        const key = mapTypeToQueryKey(f.type);
        const pressed = query[key].includes(f.filter.slug);
        return (
          <Toggle
            key={`${key}.${f.filter.id}`}
            pressed={pressed}
            onPressedChange={(pressed) => {
              onCheckedChange(key, f.filter.slug, pressed);
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
