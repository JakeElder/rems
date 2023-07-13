import api from "../api";
import { FiltersContext, FilterBar as FilterBarView } from "@rems/ui";
import React from "react";
import {
  MAX_LIVING_AREA_SIZES,
  MAX_LOT_SIZES,
  MAX_PURCHASE_PRICE,
  MAX_RENTAL_PRICE,
  MIN_LIVING_AREA_SIZES,
  MIN_LOT_SIZES,
  MIN_PURCHASE_PRICE,
  MIN_RENTAL_PRICE
} from "../constants";

type Props = {};

const FilterBar = async ({}: Props) => {
  const [
    btsStations,
    indoorFeatures,
    lotFeatures,
    mrtStations,
    outdoorFeatures,
    viewTypes,
    propertyTypes,
    quickFilters,
    areas
  ] = await Promise.all([
    api.get.btsStations(),
    api.get.indoorFeatures(),
    api.get.lotFeatures(),
    api.get.mrtStations(),
    api.get.outdoorFeatures(),
    api.get.viewTypes(),
    api.get.propertyTypes(),
    api.get.quickFilters(),
    api.get.areas()
  ]);

  return (
    <FiltersContext
      value={{
        areas,
        btsStations,
        indoorFeatures,
        lotFeatures,
        mrtStations,
        outdoorFeatures,
        propertyTypes,
        viewTypes,
        livingAreaSizes: {
          min: MIN_LIVING_AREA_SIZES,
          max: MAX_LIVING_AREA_SIZES
        },
        lotSizes: {
          min: MIN_LOT_SIZES,
          max: MAX_LOT_SIZES
        },
        priceRange: {
          minRentalPrice: MIN_RENTAL_PRICE,
          maxRentalPrice: MAX_RENTAL_PRICE,
          minPurchasePrice: MIN_PURCHASE_PRICE,
          maxPurchasePrice: MAX_PURCHASE_PRICE
        },
        quickFilters
      }}
    >
      <FilterBarView />
    </FiltersContext>
  );
};

export default FilterBar;
