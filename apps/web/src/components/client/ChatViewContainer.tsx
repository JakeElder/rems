"use client";

import React, { useEffect, useRef } from "react";
import { Chat } from "@rems/ui";
import { useAssistant } from "@/components/AssistantProvider";

type Props = {};

const ChatViewContainer = ({}: Props) => {
  const { timeline, open, onOpenClose } = useAssistant();
  const audio = useRef<{ message?: HTMLAudioElement }>({});

  useEffect(() => {
    audio.current.message = new Audio("/click.mp3");
    audio.current.message.volume = 0.6;
  }, []);

  return (
    <Chat
      timeline={timeline}
      lang="en"
      state="SLEEPING"
      open={open}
      audio={audio}
      onOpenClose={onOpenClose}
    />
  );
};

export default ChatViewContainer;
