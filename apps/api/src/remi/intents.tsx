import { Intent } from "@rems/types";
import md from "@rems/utils/md";

const intents: Intent[] = [
  {
    id: 130,
    code: "CHOOSE_ONE_PROPERTY",
    description: md(
      <>Reduce the list of properties to one based on criteria</>
    ),
    examples: [
      "Which one of these is the most expensive?",
      "Which has the most indoor features."
    ]
  },

  {
    id: 130,
    code: "QUERY_SELECTED_PROPERTY",
    description: md(
      <>
        Used when the user asks a specific question about the selected property
      </>
    ),
    examples: [
      "How big is this property",
      "What is the price of this property."
    ]
  },

  {
    id: 30,
    code: "REFINE_LOCATION",
    description: md(<>Sets a new search location</>),
    examples: []
  },

  {
    id: 50,
    code: "REFINE_PAGE",
    description: md(<>Changes the search result page</>),
    examples: []
  },

  {
    id: 60,
    code: "REFINE_SORT",
    description: md(<>Changes the sort order</>),
    examples: []
  },

  {
    id: 70,
    code: "REFINE_SPACE_REQUIREMENTS",
    description: md(<>Updates min/max bathrooms, living area and lot size</>),
    examples: []
  },

  {
    id: 80,
    code: "REFINE_BUDGET_AVAILABILITY",
    description: md(
      <>Sets the users budget and whether they are interested in sale or rent</>
    ),
    examples: []
  },

  {
    id: 90,
    code: "REFINE_INDOOR_FEATURES",
    description: md(<>Updates the *indoor feature* filters</>),
    examples: []
  },

  {
    id: 100,
    code: "REFINE_OUTDOOR_FEATURES",
    description: md(<>Updates the *outdoor feature* filters</>),
    examples: []
  },

  {
    id: 110,
    code: "REFINE_LOT_FEATURES",
    description: md(<>Updates the *lot feature* filters</>),
    examples: []
  },

  {
    id: 120,
    code: "REFINE_VIEW_TYPES",
    description: md(<>Updates the *view type* filters</>),
    examples: []
  },

  {
    id: 130,
    code: "REFINE_PROPERTY_TYPES",
    description: md(<>Updates the *property type* filters</>),
    examples: []
  },

  {
    id: 140,
    code: "REQUEST_CLARIFICATION",
    description: md(
      <>
        Prompts the user for clarification as it is unclear what functions
        should be called
      </>
    ),
    examples: []
  },

  {
    id: 150,
    code: "GET_ASSISTANTS_ATTENTION",
    description: md(<>Prepares the assistant for further input</>),
    examples: ["Hey, Remi"]
  }
];

export default intents;
