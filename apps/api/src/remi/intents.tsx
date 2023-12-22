import { Intent } from "@rems/types";
import md from "@rems/utils/md";

const intents: Intent[] = [
  {
    id: 20,
    code: "CHAT",
    description: md(<>The user just wants to chat</>),
    requiresWork: false,
    examples: []
  },

  {
    id: 30,
    code: "REFINE_LOCATION",
    description: md(
      <>The user wants to specify the search origin for their search</>
    ),
    requiresWork: true,
    examples: []
  },

  {
    id: 40,
    code: "OBTAIN_GENERAL_INFORMATION",
    requiresWork: false,
    description: md(
      <>The user wants to specify the search origin for their search</>
    ),
    examples: []
  },

  {
    id: 50,
    code: "REFINE_PAGE",
    requiresWork: true,
    description: md(<>The user wants to change either the current page </>),
    examples: []
  },

  {
    id: 60,
    code: "REFINE_SORT",
    requiresWork: true,
    description: md(<>The user wants to change the sort order</>),
    examples: []
  },

  {
    id: 70,
    code: "REFINE_SPACE_REQUIREMENTS",
    requiresWork: true,
    description: md(
      <>
        <p>The user wants to specify search criteria relating to space.</p>
        <p>This could be</p>
        <ul>
          <li>Min/Max bedrooms</li>
          <li>Min bathrooms</li>
          <li>Min/Max living area</li>
          <li>Min/Max lot size</li>
        </ul>
      </>
    ),
    examples: []
  },

  {
    id: 80,
    code: "REFINE_BUDGET_AVAILABILITY",
    requiresWork: true,
    description: md(
      <>
        The user wants to set their budget/whether they are looking to rent or
        buy
      </>
    ),
    examples: []
  },

  {
    id: 90,
    code: "REFINE_INDOOR_FEATURES",
    requiresWork: true,
    description: "Refine indoor features",
    examples: []
  },

  {
    id: 100,
    code: "REFINE_OUTDOOR_FEATURES",
    requiresWork: true,
    description: "Refine outdoor features",
    examples: []
  },

  {
    id: 110,
    code: "REFINE_LOT_FEATURES",
    requiresWork: true,
    description: "Refine lot features",
    examples: []
  },

  {
    id: 120,
    code: "REFINE_VIEW_TYPES",
    requiresWork: true,
    description: "Refine view types",
    examples: []
  },

  {
    id: 130,
    code: "REFINE_PROPERTY_TYPES",
    requiresWork: true,
    description: "Refine property types",
    examples: []
  },

  {
    id: 130,
    code: "OBTAIN_SELECTED_PROPERTY_INFO",
    requiresWork: false,
    description: md(
      <>
        The user wants the assistant to summarise the currently selected
        property in some way
      </>
    ),
    examples: []
  },

  {
    id: 500,
    code: "UNKNOWN",
    requiresWork: false,
    description: md(
      <>
        It is unclear that the user's intent falls within one of our defined
        options
      </>
    ),
    examples: []
  }
];

export default intents;
