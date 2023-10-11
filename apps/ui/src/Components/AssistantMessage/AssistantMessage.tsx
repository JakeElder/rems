import React, { forwardRef } from "react";
import css from "./AssistantMessage.module.css";
import { AssistantMessage as AssistantMessageType } from "@rems/types";
import LanguageBasedAssistantMessage from "../LanguageBasedAssistantMessage";
import PatchMessage from "../PatchMessage";

const AssistantMessage = forwardRef<HTMLDivElement, AssistantMessageType>(
  (message, ref) => {
    if (
      message.type === "REACTION" &&
      message.reaction.type === "LANGUAGE_BASED"
    ) {
      return (
        <div className={css["root"]} ref={ref}>
          <div className={css["message"]}>
            <LanguageBasedAssistantMessage>
              {message.reaction.message}
            </LanguageBasedAssistantMessage>
          </div>
        </div>
      );
    }

    if (message.type === "REACTION" && message.reaction.type === "PATCH") {
      return (
        <div className={css["root"]} ref={ref}>
          <div className={css["message"]}>
            <PatchMessage {...message.reaction} />
          </div>
        </div>
      );
    }

    return null;
  }
);

export default AssistantMessage;
