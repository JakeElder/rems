import { QueryRefinementSummary } from "@rems/types";

const summary: QueryRefinementSummary = {
  input:
    "3 bedroom condos with a cinema and a bar around 15k per month, in chiang mai",
  intents: [
    "REFINE_INDOOR_FEATURES",
    "REFINE_SPACE_REQUIREMENTS",
    "REFINE_BUDGET_AVAILABILITY",
    "REFINE_LOCATION"
  ],
  resolutions: [
    {
      intent: "REFINE_LOCATION",
      type: "PATCH",
      reaction: {
        type: "PATCH_SCALAR",
        patch: {
          "origin-lat": 18.7883439,
          "origin-lng": 98.98530079999999,
          "origin-id": "ChIJXW-7kH462jARZ0ObpXBi1Jg"
        }
      }
    },
    { intent: "REFINE_PAGE", type: "NOOP" },
    { intent: "REFINE_SORT", type: "NOOP" },
    {
      intent: "REFINE_SPACE_REQUIREMENTS",
      type: "PATCH",
      reaction: {
        type: "PATCH_SCALAR",
        patch: { "min-bedrooms": 3, "max-living-area": 100 }
      }
    },
    {
      intent: "REFINE_BUDGET_AVAILABILITY",
      type: "PATCH",
      reaction: {
        type: "PATCH_SCALAR",
        patch: {
          "min-price": 13500,
          "max-price": 16500,
          availability: "rent"
        }
      }
    },
    { intent: "REFINE_MAP_STATE", type: "NOOP" },
    {
      intent: "REFINE_INDOOR_FEATURES",
      type: "PATCH",
      reaction: {
        type: "PATCH_ARRAY",
        key: "indoor-features",
        value: ["bar", "cinema"]
      }
    },
    { intent: "REFINE_OUTDOOR_FEATURES", type: "NOOP" },
    { intent: "REFINE_LOT_FEATURES", type: "NOOP" },
    { intent: "REFINE_PROPERTY_TYPES", type: "NOOP" },
    { intent: "REFINE_VIEW_TYPES", type: "NOOP" }
  ]
};

export default summary;
