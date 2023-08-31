import { txt } from "@/remi";
import { Intent } from "@rems/types";

const intents: Intent[] = [
  {
    id: 1,
    code: "REFINE_INDOOR_FEATURES",
    name: "Refine Indoor Features",
    description: txt(
      <>
        The user wants to add or remove a filter from the available set of
        indoor features
      </>
    ),
    examples: [
      {
        input: "I'm looking for a 3 bedroom condo with a bar",
        matches: ["with a bar"]
      }
    ]
  },

  {
    id: 2,
    code: "REFINE_OUTDOOR_FEATURES",
    name: "Refine Outdoor Features",
    description: txt(
      <>
        The user wants to add or remove a filter from the available set of
        outdoor features
      </>
    ),
    examples: [
      {
        input: "I'm looking for a 3 bedroom condo with a garden",
        matches: ["with a garden"]
      }
    ]
  },

  {
    id: 3,
    code: "REFINE_LOT_FEATURES",
    name: "Refine Lot Features",
    description: txt(
      <>
        The user wants to add or remove a filter from the available set of lot
        features
      </>
    ),
    examples: [
      {
        input: "I'm looking for a high altitude 3 bedroom condo",
        matches: ["high altitude"]
      }
    ]
  },

  {
    id: 4,
    code: "REFINE_VIEW_TYPES",
    name: "Refine View Types",
    description: txt(
      <>
        The user wants to add or remove a filter from the available set of view
        types
      </>
    ),
    examples: [
      {
        input: "I'm looking for a 3 bedroom condo with a city view",
        matches: ["with a city view"]
      }
    ]
  },

  {
    id: 5,
    code: "REFINE_PROPERTY_TYPES",
    name: "Refine Property Types",
    description: txt(
      <>
        The user wants to add or remove a filter from the available set of
        property types
      </>
    ),
    examples: [
      {
        input: "I'm looking for a 3 bedroom condo or apartment",
        matches: ["condo or apartment"]
      }
    ]
  },

  {
    id: 6,
    code: "REFINE_LOCATION",
    name: "Refine Location",
    description: txt(
      <>The user wants to specify the search origin for their search</>
    ),
    examples: [
      {
        input: "I'm looking for a 3 bedroom condo or apartment",
        matches: ["condo or apartment"]
      }
    ]
  },

  {
    id: 7,
    code: "REFINE_PAGE_SORT",
    name: "Refine Page/Sort",
    description: txt(
      <>
        The user wants to change either the current page, or the order the
        properties are sorted
      </>
    ),
    examples: [
      {
        input: "Go forward a page",
        matches: ["Go forward a page"]
      },
      {
        input: "Sort by lot size",
        matches: ["Sort by lot size"]
      }
    ]
  }
];

export default intents;
