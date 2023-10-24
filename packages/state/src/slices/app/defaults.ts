import { nanoid } from "@reduxjs/toolkit";
import { AppState } from "@rems/types";

const defaults: AppState = {
  slices: {
    realEstateQuery: {
      budgetAndAvailability: {
        type: "SALE",
        minPrice: 0,
        maxPrice: null
      },
      locationSource: {
        type: "NL",
        description: "Bangkok",
        geospatialOperator: "in",
        radius: null
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
    },
    assistant: {
      mode: "SLEEPING",
      placement: "MINIMISED",
      sessions: [{ id: nanoid(), value: "", state: "INACTIVE" }]
    },
    keyboard: {
      enterDown: false,
      spaceDown: false
    }
  },
  timeline: []
};

export default defaults;
