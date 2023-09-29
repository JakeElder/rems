import randomInt from "random-int";
import { Timeline } from "@rems/types";

let dates = 0;
const date = () => Date.now() + ++dates * randomInt(400, 1200);

const timeline: Timeline = [
  {
    role: "USER",
    id: "1",
    date: date(),
    event: {
      type: "LANGUAGE_BASED",
      message: "Show me 3 bedroom properties"
    }
  },
  {
    role: "ASSISTANT",
    id: "12",
    date: date(),
    event: {
      type: "LANGUAGE_BASED",
      message: "Sure! I can do that"
    }
  },
  {
    role: "ASSISTANT",
    id: "2",
    date: date(),
    event: {
      type: "PATCH",
      patch: {
        type: "SCALAR",
        group: "PAGE",
        data: { page: 2 },
        diff: [{ type: "CHANGE_SCALAR", k: "page", value: [1, 2] }]
      }
    }
  },
  {
    role: "ASSISTANT",
    id: "30",
    date: date(),
    event: {
      type: "PATCH",
      patch: {
        group: "INDOOR_FEATURES",
        type: "ARRAY",
        key: "indoor-features",
        value: ["pet-friendly", "swimming-pool"],
        diff: []
      }
    }
  },
  {
    role: "ASSISTANT",
    id: "3",
    date: date(),
    event: {
      type: "PATCH",
      patch: {
        type: "ARRAY",
        group: "INDOOR_FEATURES",
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
  },
  {
    role: "ASSISTANT",
    id: "4",
    date: date(),
    event: {
      type: "PATCH",
      patch: {
        type: "SCALAR",
        group: "LOCATION",
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
  },
  {
    role: "ASSISTANT",
    id: "50",
    date: date(),
    event: {
      type: "PATCH",
      patch: {
        type: "SCALAR",
        group: "SPACE_REQUIREMENTS",
        data: {
          "min-bedrooms": 3,
          "max-bedrooms": 4
        },
        diff: []
      }
    }
  },
  {
    role: "ASSISTANT",
    id: "5",
    date: date(),
    event: {
      type: "PATCH",
      patch: {
        type: "SCALAR",
        group: "SPACE_REQUIREMENTS",
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
  },
  {
    role: "ASSISTANT",
    id: "6",
    date: date(),
    event: {
      type: "LANGUAGE_BASED",
      message:
        "Ok, I’ve set the min bedrooms to 3. Is there anything else you’d like me to do?"
    }
  }
];

export default timeline;
