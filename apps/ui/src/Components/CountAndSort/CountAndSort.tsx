"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import css from "./CountAndSort.module.css";
import { RealEstateQuery, SortType } from "@rems/types";
import { Oval } from "react-loader-spinner";

type Props = {
  loading: boolean;
  sort: RealEstateQuery["pageAndSort"]["sort"];
  onChange: (value: RealEstateQuery["pageAndSort"]["sort"]) => void;
  listings?: number;
};

const label = (sort: SortType) => {
  const map: Record<SortType, string> = {
    NEWEST_FIRST: "Newest first",
    LOWEST_PRICE_FIRST: "Lowest price first",
    HIGHEST_PRICE_FIRST: "Highest price first",
    SMALLEST_LIVING_AREA_FIRST: "Smallest living area",
    LARGEST_LIVING_AREA_FIRST: "Largest living area",
    CLOSEST_FIRST: "Closest first",
    FURTHEST_FIRST: "Furthest first"
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
            color="#8850a2"
            secondaryColor="#8850a2"
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
            onChange(
              e.currentTarget.value as RealEstateQuery["pageAndSort"]["sort"]
            );
          }}
        >
          <option value="NEWEST_FIRST">{label("NEWEST_FIRST")}</option>
          <option value="LOWEST_PRICE_FIRST">
            {label("LOWEST_PRICE_FIRST")}
          </option>
          <option value="HIGHEST_PRICE_FIRST">
            {label("HIGHEST_PRICE_FIRST")}
          </option>
          <option value="SMALLEST_LIVING_AREA_FIRST">
            {label("SMALLEST_LIVING_AREA_FIRST")}
          </option>
          <option value="LARGEST_LIVING_AREA_FIRST">
            {label("LARGEST_LIVING_AREA_FIRST")}
          </option>
          <option value="CLOSEST_FIRST">{label("CLOSEST_FIRST")}</option>
          <option value="FURTHEST_FIRST">{label("FURTHEST_FIRST")}</option>
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
