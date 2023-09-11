import React from "react";
import css from "./Message.module.css";
import { AssistantMessage, TimelineEvent, UserInteraction } from "@rems/types";

type Props = TimelineEvent;

const Message = (event: Props) => {
  return event.type === "USER" ? (
    <UserMessage {...event.interaction} />
  ) : (
    <AssistantMessage {...event.message} />
  );
};

const UserMessage = (interaction: UserInteraction) => {
  return <div>{interaction.type}</div>;
};

const AssistantMessage = (message: AssistantMessage) => {
  return <div>{message.type}</div>;
};

export default Message;
