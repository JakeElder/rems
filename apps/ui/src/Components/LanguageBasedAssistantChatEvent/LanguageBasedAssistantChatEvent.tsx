import React from "react";
import css from "./LanguageBasedAssistantChatEvent.module.css";

type Props = {
  children: React.ReactNode;
};

const LanguageBasedAssistantChatEvent = ({ children }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["message"]}>{children}</div>
    </div>
  );
};

export default LanguageBasedAssistantChatEvent;
