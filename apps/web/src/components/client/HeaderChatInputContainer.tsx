"use client";

import React, { useRef } from "react";
import { ChatInput } from "@rems/ui";
import useAssistantState from "@/hooks/use-assistant-state";

const HeaderChatInputContainer = () => {
  const state = useAssistantState();
  const $input = useRef<HTMLInputElement>(null);

  return null;

  // useEffect(() => {
  //   if (assistant.session.value) {
  //     if (assistant.state === "LISTENING") {
  //       Promise.resolve().then(() => {
  //         $input.current!.scrollLeft = $input.current!.scrollWidth;
  //       });
  //     }
  //   }
  // }, [assistant.session.value]);

  return <ChatInput ref={$input} {...state} theme="header" />;
};

export default HeaderChatInputContainer;
