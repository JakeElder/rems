import React from "react";
import css from "./ChatMessage.module.css";
import UserInteraction from "../UserInteraction/UserInteraction";
import { TimelineEvent } from "@rems/types";
import AssistantMessage from "../AssistantMessage";

const ChatMessage = (event: TimelineEvent) => {
  if (event.type === "USER") {
    return <UserInteraction {...event.interaction} />;
  }

  if (event.type === "ASSISTANT") {
    return <AssistantMessage {...event.message} />;
  }

  throw new Error("Wtf type of event is that bruh");
};

export default ChatMessage;
