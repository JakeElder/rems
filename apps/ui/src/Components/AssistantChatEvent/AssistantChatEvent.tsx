import React, { forwardRef } from "react";
import css from "./AssistantChatEvent.module.css";
import LanguageBasedAssistantChatEvent from "../LanguageBasedAssistantChatEvent";
import PatchMessage from "../PatchMessage";
import { AssistantEvent } from "@rems/types";

const AssistantChatEvent = forwardRef<HTMLDivElement, AssistantEvent>(
  (e, ref) => {
    if (e.type === "YIELD") {
      return (
        <div className={css["root"]} ref={ref}>
          <div className={css["message"]}>
            <LanguageBasedAssistantChatEvent>
              {e.message}
            </LanguageBasedAssistantChatEvent>
          </div>
        </div>
      );
    }

    if (e.type === "STATE_MUTATION") {
      return (
        <div className={css["root"]} ref={ref}>
          <div className={css["message"]}>
            <PatchMessage {...e.mutation.patch} />
          </div>
        </div>
      );
    }

    return null;
  }
);

export default AssistantChatEvent;
