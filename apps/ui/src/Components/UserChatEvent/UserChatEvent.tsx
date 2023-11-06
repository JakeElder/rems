import React, { forwardRef } from "react";
import css from "./UserChatEvent.module.css";
import { UserEvent } from "@rems/types";
import LanguageBasedUserChatEvent from "../LanguageBasedUserChatEvent";

const UserChatEvent = forwardRef<HTMLDivElement, UserEvent>((e, ref) => {
  if (e.type === "YIELD") {
    return (
      <div className={css["root"]} ref={ref}>
        <LanguageBasedUserChatEvent>{e.message}</LanguageBasedUserChatEvent>
      </div>
    );
  }
  return null;
});

export default UserChatEvent;
