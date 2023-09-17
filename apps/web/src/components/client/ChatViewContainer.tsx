"use client";

import React from "react";
import { Chat } from "@rems/ui";
import useAssistant from "@/hooks/use-assistant";
import dynamic from "next/dynamic";

type Props = {};

const ChatViewContainer = ({}: Props) => {
  const audio = new Audio("/click.mp3");
  audio.volume = 0.1;
  const { timeline } = useAssistant();
  return <Chat timeline={timeline} lang="en" state="SLEEPING" open={true} />;
};

export default dynamic(() => Promise.resolve(ChatViewContainer), {
  ssr: false
});
