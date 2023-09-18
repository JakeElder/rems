"use client";

import React from "react";
import { Chat } from "@rems/ui";
import useAssistant from "@/hooks/use-a";
import dynamic from "next/dynamic";

type Props = {};

const ChatViewContainer = ({}: Props) => {
  const { timeline, spaceDown } = useAssistant();

  const audio = new Audio("/click.mp3");
  audio.volume = 0.1;

  return (
    <Chat timeline={timeline} lang="en" state="SLEEPING" open={spaceDown} />
  );
};

export default dynamic(() => Promise.resolve(ChatViewContainer), {
  ssr: false
});
