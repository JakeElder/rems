import React from "react";
import css from "./AssistantMessage.module.css";
import { AssistantMessage as AssistantMessageType } from "@rems/types";
import LanguageBasedAssistantMessage from "../LanguageBasedAssistantMessage";
import PatchMessage from "../PatchMessage";

const AssistantMessage = (message: AssistantMessageType) => {
  if (
    message.type === "REACTION" &&
    message.reaction.type === "LANGUAGE_BASED"
  ) {
    return (
      <div className={css["root"]}>
        <LanguageBasedAssistantMessage>
          {message.reaction.message}
        </LanguageBasedAssistantMessage>
      </div>
    );
  }

  if (message.type === "REACTION" && message.reaction.type === "PATCH") {
    return (
      <div className={css["root"]}>
        <PatchMessage {...message.reaction} />
      </div>
    );
  }

  return null;
};

export default AssistantMessage;
