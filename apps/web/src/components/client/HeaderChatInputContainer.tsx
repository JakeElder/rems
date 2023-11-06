"use client";

import React, { useEffect, useRef } from "react";
import { ChatInput } from "@rems/ui";
import { useAssistant } from "@/components/AssistantProvider";

const HeaderChatInputContainer = () => {
  const assistant = useAssistant();
  const $input = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (assistant.session.value) {
  //     if (assistant.state === "LISTENING") {
  //       Promise.resolve().then(() => {
  //         $input.current!.scrollLeft = $input.current!.scrollWidth;
  //       });
  //     }
  //   }
  // }, [assistant.session.value]);

  return (
    <ChatInput
      ref={$input}
      submittable={assistant.submittable}
      onMicClick={assistant.onMicClick}
      onKeyDown={assistant.onKeyDown}
      onKeyUp={assistant.onKeyUp}
      enterDown={assistant.enterDown}
      sessions={assistant.sessions}
      onChange={assistant.onChange}
      theme="header"
    />
  );
};

export default HeaderChatInputContainer;
