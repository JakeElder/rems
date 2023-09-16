import React from "react";
import css from "./UserInteraction.module.css";
import { UserInteraction as UserInteractionType } from "@rems/types";
import LanguageBasedUserMessage from "../LanguageBasedUserMessage/LanguageBasedUserMessage";

const UserInteraction = (interaction: UserInteractionType) => {
  if (interaction.type === "VERBAL" || interaction.type === "WRITTEN") {
    return (
      <div className={css["root"]}>
        <LanguageBasedUserMessage>{interaction.input}</LanguageBasedUserMessage>
      </div>
    );
  }
  return null;
};

export default UserInteraction;
