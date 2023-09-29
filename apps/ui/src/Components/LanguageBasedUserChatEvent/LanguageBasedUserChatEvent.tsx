import React from "react";
import css from "./LanguageBasedUserChatEvent.module.css";

type Props = {
  children: React.ReactNode;
};

const LanguageBasedUserChatEvent = ({ children }: Props) => {
  return <div className={css["root"]}>{children}</div>;
};

export default LanguageBasedUserChatEvent;
