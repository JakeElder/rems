"use client";

import React from "react";
import useQuery from "../hooks/use-real-estate-query";
import { QuickFilter } from "@rems/types";

type Props = {
  filters: QuickFilter[];
};

const Filters = ({ filters }: Props) => {
  const { isChecked, onCheckedChange } = useQuery();
  return (
    <div>
      {filters.map((f) => {
        return (
          <label
            key={f.filter.slug}
            htmlFor={f.filter.slug}
            style={{ color: isChecked(f.filter.slug) ? "red" : "black" }}
          >
            <input
              id={f.filter.slug}
              type="checkbox"
              checked={isChecked(f.filter.slug)}
              onChange={(e) => {
                e.preventDefault();
                onCheckedChange(f.filter.slug, e.currentTarget.checked);
              }}
            />
            {f.filter.name}
          </label>
        );
      })}
    </div>
  );
};

export default Filters;
