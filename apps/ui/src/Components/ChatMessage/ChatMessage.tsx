import React, { forwardRef } from "react";
import css from "./ChatMessage.module.css";
import UserInteraction from "../UserInteraction/UserInteraction";
import { TimelineEvent } from "@rems/types";
import AssistantMessage from "../AssistantMessage";

const ChatMessage = forwardRef<HTMLDivElement, TimelineEvent>((event, ref) => {
  if (event.type === "USER") {
    return <UserInteraction {...event.interaction} ref={ref} />;
  }

  if (event.type === "ASSISTANT") {
    return <AssistantMessage {...event.message} ref={ref} />;
  }

  throw new Error("Wtf type of event is that bruh");
});

export default ChatMessage;
