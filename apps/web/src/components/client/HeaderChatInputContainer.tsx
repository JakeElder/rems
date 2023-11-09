"use client";

import React, { useEffect, useRef } from "react";
import { ChatInput } from "@rems/ui";
import useAssistantState from "@/hooks/use-assistant-state";
import useAssistantCallbacks from "@/hooks/use-assistant-callbacks";

const HeaderChatInputContainer = () => {
  const { enterDown, sessions, session, submittable, mode } =
    useAssistantState();
  const { onChange, onKeyDown, onKeyUp, onMicClick } = useAssistantCallbacks();

  const $input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session.value) {
      if (mode === "LISTENING") {
        Promise.resolve().then(() => {
          $input.current!.scrollLeft = $input.current!.scrollWidth;
        });
      }
    }
  }, [session.value]);

  return (
    <ChatInput
      ref={$input}
      theme="header"
      enterDown={enterDown}
      sessions={sessions}
      onMicClick={onMicClick}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      submittable={submittable}
    />
  );
};

export default HeaderChatInputContainer;
