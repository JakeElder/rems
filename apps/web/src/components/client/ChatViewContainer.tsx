"use client";

import React, { useEffect, useRef } from "react";
import { Chat, ChatInput } from "@rems/ui";
import { useAssistant } from "@/components/AssistantProvider";

type Props = {};

const ChatViewContainer = ({}: Props) => {
  const props = useAssistant();
  const $input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.session.value) {
      if (props.session.state === "LISTENING") {
        Promise.resolve().then(() => {
          $input.current!.scrollLeft = $input.current!.scrollWidth;
        });
      }
    }
  }, [props.session.value]);

  if (!props.ready) {
    return null;
  }

  return (
    <Chat.Root {...props}>
      <Chat.Dialog>
        <Chat.Header {...props} />
        <Chat.Body {...props} />
      </Chat.Dialog>
      <Chat.Input>
        <ChatInput ref={$input} {...props} theme="chat" />
      </Chat.Input>
    </Chat.Root>
  );
};

export default ChatViewContainer;
