"use client";

import React from "react";
import { Chat } from "@rems/ui";
import { Timeline } from "@rems/types";

type Props = {};

const timeline: Timeline = [
  {
    type: "USER",
    id: "1",
    date: Date.now(),
    interaction: {
      type: "VERBAL",
      input: "Show me 3 bedroom properties"
    }
  }
];

const ChatViewContainer = ({}: Props) => {
  return <Chat timeline={timeline} lang="en" state="SLEEPING" />;
};

export default ChatViewContainer;
