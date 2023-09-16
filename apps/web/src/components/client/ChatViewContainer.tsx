"use client";

import React from "react";
import { Chat } from "@rems/ui";
import useAssistant from "@/hooks/use-assistant";

type Props = {};

const ChatViewContainer = ({}: Props) => {
  const { timeline } = useAssistant();
  return <Chat timeline={timeline} lang="en" state="SLEEPING" open={true} />;
};

export default ChatViewContainer;
