import { Intent } from "@rems/types";
import md from "@rems/utils/md";

const intents: Intent[] = [
  {
    id: 130,
    code: "CHOOSE_ONE_PROPERTY",
    requiresWork: false,
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
    requiresWork: false,
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
    requiresWork: true,
    examples: []
  },

  {
    id: 50,
    code: "REFINE_PAGE",
    requiresWork: true,
    description: md(<>Changes the search result page</>),
    examples: []
  },

  {
    id: 60,
    code: "REFINE_SORT",
    requiresWork: true,
    description: md(<>Changes the sort order</>),
    examples: []
  },

  {
    id: 70,
    code: "REFINE_SPACE_REQUIREMENTS",
    requiresWork: true,
    description: md(<>Updates min/max bathrooms, living area and lot size</>),
    examples: []
  },

  {
    id: 80,
    code: "REFINE_BUDGET_AVAILABILITY",
    requiresWork: true,
    description: md(
      <>Sets the users budget and whether they are interested in sale or rent</>
    ),
    examples: []
  },

  {
    id: 90,
    code: "REFINE_INDOOR_FEATURES",
    requiresWork: true,
    description: md(<>Updates the *indoor feature* filters</>),
    examples: []
  },

  {
    id: 100,
    code: "REFINE_OUTDOOR_FEATURES",
    requiresWork: true,
    description: md(<>Updates the *outdoor feature* filters</>),
    examples: []
  },

  {
    id: 110,
    code: "REFINE_LOT_FEATURES",
    requiresWork: true,
    description: md(<>Updates the *lot feature* filters</>),
    examples: []
  },

  {
    id: 120,
    code: "REFINE_VIEW_TYPES",
    requiresWork: true,
    description: md(<>Updates the *view type* filters</>),
    examples: []
  },

  {
    id: 130,
    code: "REFINE_PROPERTY_TYPES",
    requiresWork: true,
    description: md(<>Updates the *property type* filters</>),
    examples: []
  },

  {
    id: 140,
    code: "REQUEST_CLARIFICATION",
    requiresWork: true,
    description: md(
      <>
        Prompts the user for clarification as it is unclear what functions
        should be called
      </>
    ),
    examples: []
  }
];

export default intents;
