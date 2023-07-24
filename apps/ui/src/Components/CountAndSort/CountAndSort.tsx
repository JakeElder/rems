"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import css from "./CountAndSort.module.css";
import { RealEstateQuery, SortType } from "@rems/types";
import { Oval } from "react-loader-spinner";

type Props = {
  loading: boolean;
  sort: RealEstateQuery["sort"];
  onChange: (value: RealEstateQuery["sort"]) => void;
  listings?: number;
};

const label = (sort: SortType) => {
  const map: Record<SortType, string> = {
    "newest-first": "Newest first",
    "lowest-price-first": "Lowest price first",
    "highest-price-first": "Highest price first",
    "smallest-living-area-first": "Smallest living area",
    "largest-living-area-first": "Largest living area"
  };
  return map[sort];
};

const CountAndSort = ({ sort, loading, listings, onChange }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["count"]}>
        {loading ? (
          <Oval
            height={16}
            width={16}
            color="#c19d54"
            secondaryColor="#c19d54"
            visible={true}
          />
        ) : (
          `${listings} listings`
        )}
      </div>
      <div className={css["sort"]}>
        <select
          className={css["select"]}
          value={sort}
          onChange={(e) => {
            onChange(e.currentTarget.value as RealEstateQuery["sort"]);
          }}
        >
          <option value="newest-first">{label("newest-first")}</option>
          <option value="lowest-price-first">
            {label("lowest-price-first")}
          </option>
          <option value="highest-price-first">
            {label("highest-price-first")}
          </option>
          <option value="smallest-living-area-first">
            {label("smallest-living-area-first")}
          </option>
          <option value="largest-living-area-first">
            {label("largest-living-area-first")}
          </option>
        </select>
        <div className={css["active"]}>
          <span className={css["label"]}>Sort:</span>
          <span className={css["selection"]}>{label(sort)}</span>
          <span className={css["icon"]}>
            <FontAwesomeIcon icon={faChevronDown} size="sm" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountAndSort;
