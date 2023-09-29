import { txt } from "@/remi";
import { Intent } from "@rems/types";

const intents: Intent[] = [
  {
    id: 1,
    code: "REFINE_INDOOR_FEATURES",
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
    code: "REFINE_PAGE",
    description: txt(<>The user wants to change either the current page </>),
    examples: [
      {
        input: "Go forward a page",
        matches: ["Go forward a page"]
      }
    ]
  },

  {
    id: 8,
    code: "REFINE_SORT",
    description: txt(<>The user wants to change the sort order</>),
    examples: [
      {
        input: "Sort by lot size",
        matches: ["Sort by lot size"]
      }
    ]
  },

  {
    id: 9,
    code: "REFINE_SPACE_REQUIREMENTS",
    description: txt(
      <>
        <p>The user wants to specify search criteria relating to space.</p>
        <p>This could be any of the following;</p>
        <ul>
          <li>Min/Max bedrooms</li>
          <li>Min bathrooms</li>
          <li>Min/Max living area</li>
          <li>Min/Max lot size</li>
        </ul>
      </>
    ),
    examples: [
      {
        input: "I'm looking for a 3 bedroom, 2 bathroom condo, around 100m2",
        matches: ["3 bedroom", "2 bathroom", "around 100m2"]
      }
    ]
  },

  {
    id: 10,
    code: "REFINE_BUDGET_AVAILABILITY",
    description: txt(
      <>
        The user wants to set their budget/whether they are looking to rent or
        buy
      </>
    ),
    examples: [
      {
        input: "3 bedroom condos around 20k per month",
        matches: ["around 20k per month"]
      }
    ]
  },

  {
    id: 11,
    code: "REFINE_MAP_STATE",
    description: txt(
      <>The user wants to modify the state of the listings map</>
    ),
    examples: [
      {
        input: "Shift north a bit",
        matches: ["Shift north a bit"]
      },
      {
        input: "Enable the zoom radius",
        matches: ["Enable the zoom radius"]
      }
    ]
  },

  {
    id: 13,
    code: "RECEIVE_GENERAL_INFORMATION",
    description: txt(
      <>The user is trying to extrapolate general information</>
    ),
    examples: [
      {
        input: "What's the land area of Chiang Mai",
        matches: ["What's the land area of Chiang Mai"]
      }
    ]
  },

  {
    id: 100,
    code: "UNKNOWN",
    description: txt(
      <>
        The user has issued a command that is either incomprehnsible, or lacks
        the clarity required to properly identify an appropriate reaction.
      </>
    ),
    examples: [{ input: "asdfas", matches: ["asdfas"] }]
  }
];

export default intents;
