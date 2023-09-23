"use client";

import React, { useEffect, useRef } from "react";
import { Chat, ChatInput } from "@rems/ui";
import { useAssistant } from "@/components/AssistantProvider";

type Props = {};

const ChatViewContainer = ({}: Props) => {
  const assistant = useAssistant();
  const audio = useRef<{ message?: HTMLAudioElement }>({});
  const $input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (assistant.session.value) {
      if (assistant.state === "LISTENING") {
        Promise.resolve().then(() => {
          $input.current!.scrollLeft = $input.current!.scrollWidth;
        });
      }
    }
  }, [assistant.session.value]);

  useEffect(() => {
    audio.current.message = new Audio("/click.mp3");
    audio.current.message.volume = 0.6;
  }, []);

  const props: Chat.Props = {
    ...assistant,
    lang: "en",
    state: assistant.assistantState
  };

  return (
    <Chat.Root {...props}>
      <Chat.Dialog>
        <Chat.Header {...props} />
        <Chat.Body {...props} />
      </Chat.Dialog>
      <Chat.Input>
        <ChatInput ref={$input} {...assistant} />
      </Chat.Input>
    </Chat.Root>
  );
};

export default ChatViewContainer;
