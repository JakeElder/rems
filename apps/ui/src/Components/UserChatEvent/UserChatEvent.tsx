import React, { forwardRef } from "react";
import css from "./UserChatEvent.module.css";
import { UserEvent } from "@rems/types";
import LanguageBasedUserChatEvent from "../LanguageBasedUserChatEvent";
import PatchMessage from "../PatchMessage/PatchMessage";

const UserChatEvent = forwardRef<HTMLDivElement, UserEvent>((e, ref) => {
  if (e.type === "YIELD") {
    return (
      <div className={css["root"]} ref={ref}>
        <LanguageBasedUserChatEvent>{e.message}</LanguageBasedUserChatEvent>
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
});

export default UserChatEvent;
