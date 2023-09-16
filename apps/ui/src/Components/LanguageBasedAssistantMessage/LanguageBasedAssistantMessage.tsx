import React from "react";
import css from "./LanguageBasedAssistantMessage.module.css";

type Props = {
  children: React.ReactNode;
};

const LanguageBasedAssistantMessage = ({ children }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["message"]}>{children}</div>
    </div>
  );
};

export default LanguageBasedAssistantMessage;
