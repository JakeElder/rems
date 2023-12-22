import { nanoid } from "@reduxjs/toolkit";
import { AppState, RealEstateQuery } from "@rems/types";

const defaultRealEstateQuery = (): RealEstateQuery => ({
  budgetAndAvailability: {
    type: "SALE",
    minPrice: 0,
    maxPrice: null
  },
  locationSource: {
    type: "NL",
    description: "Bangkok",
    geospatialOperator: "in",
    radius: 10000
  },
  pageAndSort: {
    page: 1,
    sort: "NEWEST_FIRST"
  },
  space: {
    minBedrooms: 0,
    maxBedrooms: null,
    minBathrooms: 0,
    minLivingArea: 0,
    maxLivingArea: null,
    minLotSize: 0,
    maxLotSize: null
  },
  viewTypes: [],
  lotFeatures: [],
  indoorFeatures: [],
  outdoorFeatures: [],
  propertyTypes: []
});

const defaults = (): AppState => ({
  slices: {
    realEstateQuery: defaultRealEstateQuery(),
    stagedRealEstateQuery: defaultRealEstateQuery(),
    assistant: {
      mode: "SLEEPING",
      placement: "DOCKED",
      sessions: [{ id: nanoid(), value: "", state: "INACTIVE" }],
      language: "EN"
    },
    keyboard: {
      enterDown: false,
      spaceDown: false
    },
    selectedPropertyId: null
  },
  timeline: []
});

export default defaults;
