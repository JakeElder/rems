"use client";

import "regenerator-runtime";
import React, { useEffect, useRef } from "react";
import { ChatInput } from "@rems/ui";
import { useAssistant } from "@/components/AssistantProvider";

const AiSearchViewContainer = () => {
  const assistant = useAssistant();
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

  return (
    <ChatInput
      ref={$input}
      submittable={assistant.submittable}
      onMicClick={assistant.onMicClick}
      onKeyDown={assistant.onKeyDown}
      onKeyUp={assistant.onKeyUp}
      enterDown={assistant.enterDown}
      state={assistant.state}
      sessions={assistant.sessions}
      onChange={assistant.onChange}
    />
  );
};

export default AiSearchViewContainer;
