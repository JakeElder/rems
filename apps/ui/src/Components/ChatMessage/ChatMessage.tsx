import React, { forwardRef } from "react";
import css from "./ChatMessage.module.css";
import { TimelineEvent } from "@rems/types";
import UserChatEvent from "../UserChatEvent";
import AssistantChatEvent from "../AssistantChatEvent/AssistantChatEvent";

const ChatMessage = forwardRef<HTMLDivElement, TimelineEvent>((e, ref) => {
  if (e.role === "USER") {
    return <UserChatEvent {...e.event} ref={ref} />;
  }

  if (e.role === "ASSISTANT") {
    return <AssistantChatEvent {...e.event} ref={ref} />;
  }

  throw new Error("Wtf type of event is that bruh");
});

export default ChatMessage;
