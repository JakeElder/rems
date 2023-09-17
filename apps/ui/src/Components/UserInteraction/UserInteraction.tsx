import React, { forwardRef } from "react";
import css from "./UserInteraction.module.css";
import { UserInteraction as UserInteractionType } from "@rems/types";
import LanguageBasedUserMessage from "../LanguageBasedUserMessage/LanguageBasedUserMessage";

const UserInteraction = forwardRef<HTMLDivElement, UserInteractionType>(
  (interaction, ref) => {
    if (interaction.type === "VERBAL" || interaction.type === "WRITTEN") {
      return (
        <div className={css["root"]} ref={ref}>
          <LanguageBasedUserMessage>
            {interaction.input}
          </LanguageBasedUserMessage>
        </div>
      );
    }
    return null;
  }
);

export default UserInteraction;
