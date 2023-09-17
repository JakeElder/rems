import randomInt from "random-int";
import { Timeline } from "@rems/types";

let dates = 0;
const date = () => Date.now() + ++dates * randomInt(400, 1200);

const timeline: Timeline = [
  {
    type: "USER",
    id: "1",
    date: date(),
    interaction: {
      type: "VERBAL",
      input: "Show me 3 bedroom properties"
    }
  },
  {
    type: "ASSISTANT",
    id: "12",
    date: date(),
    message: {
      type: "REACTION",
      reaction: {
        type: "LANGUAGE_BASED",
        message: "Sure! I can do that"
      }
    }
  },
  {
    type: "ASSISTANT",
    id: "2",
    date: date(),
    message: {
      type: "REACTION",
      reaction: {
        type: "PATCH",
        group: "PAGE",
        patch: {
          type: "SCALAR",
          data: { page: 2 },
          diff: [{ type: "CHANGE_SCALAR", k: "page", value: [1, 2] }]
        }
      }
    }
  },
  {
    type: "ASSISTANT",
    id: "30",
    date: date(),
    message: {
      type: "REACTION",
      reaction: {
        type: "PATCH",
        group: "INDOOR_FEATURES",
        patch: {
          type: "ARRAY",
          key: "indoor-features",
          value: ["pet-friendly", "swimming-pool"],
          diff: []
        }
      }
    }
  },
  {
    type: "ASSISTANT",
    id: "3",
    date: date(),
    message: {
      type: "REACTION",
      reaction: {
        type: "PATCH",
        group: "INDOOR_FEATURES",
        patch: {
          type: "ARRAY",
          key: "indoor-features",
          value: ["pet-friendly", "swimming-pool"],
          diff: [
            {
              type: "REMOVE_ARRAY",
              k: "indoor-features",
              value: "balcony"
            },
            {
              type: "ADD_ARRAY",
              k: "indoor-features",
              value: "swimming-pool"
            },
            {
              type: "ADD_ARRAY",
              k: "indoor-features",
              value: "pet-friendly"
            }
          ]
        }
      }
    }
  },
  {
    type: "ASSISTANT",
    id: "4",
    date: date(),
    message: {
      type: "REACTION",
      reaction: {
        type: "PATCH",
        group: "LOCATION",
        patch: {
          type: "SCALAR",
          data: { "origin-lat": 9.5120168 },
          diff: [
            {
              type: "CHANGE_SCALAR",
              k: "origin-lat",
              value: [18.7883439, 9.5120168]
            }
          ]
        }
      }
    }
  },
  {
    type: "ASSISTANT",
    id: "50",
    date: date(),
    message: {
      type: "REACTION",
      reaction: {
        type: "PATCH",
        group: "SPACE_REQUIREMENTS",
        patch: {
          type: "SCALAR",
          data: {
            "min-bedrooms": 3,
            "max-bedrooms": 4
          },
          diff: []
        }
      }
    }
  },
  {
    type: "ASSISTANT",
    id: "5",
    date: date(),
    message: {
      type: "REACTION",
      reaction: {
        type: "PATCH",
        group: "SPACE_REQUIREMENTS",
        patch: {
          type: "SCALAR",
          data: { "min-bedrooms": 3 },
          diff: [
            {
              type: "CHANGE_SCALAR",
              k: "min-bedrooms",
              value: [2, 3]
            },
            {
              type: "REMOVE_SCALAR",
              k: "max-bedrooms",
              value: 3
            },
            {
              type: "ADD_SCALAR",
              k: "min-lot-size",
              value: 100
            }
          ]
        }
      }
    }
  },
  {
    type: "ASSISTANT",
    id: "6",
    date: date(),
    message: {
      type: "REACTION",
      reaction: {
        type: "LANGUAGE_BASED",
        message:
          "Ok, I’ve set the min bedrooms to 3. Is there anything else you’d like me to do?"
      }
    }
  }
];

export default timeline;
