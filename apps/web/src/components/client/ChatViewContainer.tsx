"use client";

import React, { useEffect, useRef } from "react";
import { Chat, ChatInput } from "@rems/ui";
import { useAssistant } from "@/components/AssistantProvider";
import { useDomElements } from "@/components/DomElementsProvider";

type Props = {};

const ChatViewContainer = ({}: Props) => {
  const assistant = useAssistant();
  const audio = useRef<{ message?: HTMLAudioElement }>({});
  const $input = useRef<HTMLInputElement>(null);

  const { $header, $listings } = useDomElements();
  const spacing = Chat.useAssistantSpacingUtility({
    $top: $header,
    $left: $listings
  });

  useEffect(() => {
    if (assistant.session.value) {
      if (assistant.session.state === "LISTENING") {
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
    spacing,
    lang: "en"
  };

  return (
    <Chat.Root {...props}>
      <Chat.Dialog>
        <Chat.Header {...props} />
        <Chat.Body {...props} />
      </Chat.Dialog>
      <Chat.Input>
        <ChatInput ref={$input} {...assistant} theme="chat" />
      </Chat.Input>
    </Chat.Root>
  );
};

export default ChatViewContainer;
