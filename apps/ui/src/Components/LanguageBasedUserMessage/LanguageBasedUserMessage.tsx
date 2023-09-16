import React from "react";
import css from "./LanguageBasedUserMessage.module.css";

type Props = {
  children: React.ReactNode;
};

const LanguageBasedUserMessage = ({ children }: Props) => {
  return <div className={css["root"]}>{children}</div>;
};

export default LanguageBasedUserMessage;
