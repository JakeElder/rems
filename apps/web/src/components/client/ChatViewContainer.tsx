"use client";

import React from "react";
import { Chat } from "@rems/ui";
import { Timeline } from "@rems/types";
import randomInt from "random-int";

type Props = {};

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
          diff: [{ type: "CHANGE_SCALAR", props: { page: [1, 2] } }]
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
              key: "indoor-features",
              values: ["balcony"]
            },
            {
              type: "ADD_ARRAY",
              key: "indoor-features",
              values: ["pet-friendly", "swimming-pool"]
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
              props: { "origin-lat": [18.7883439, 9.5120168] }
            }
          ]
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
              props: { "min-bedrooms": [2, 3] }
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
        type: "VERBAL",
        message:
          "Ok, I’ve set the min bedrooms to 3. Is there anything else you’d like me to do?"
      }
    }
  }
];

const ChatViewContainer = ({}: Props) => {
  return <Chat timeline={timeline} lang="en" state="SLEEPING" />;
};

export default ChatViewContainer;
