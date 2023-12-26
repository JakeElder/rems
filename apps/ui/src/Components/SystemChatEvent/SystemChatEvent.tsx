import React, { forwardRef } from "react";
import css from "./SystemChatEvent.module.css";
import { SystemEvent } from "@rems/types";
import PlacesMessage from "../PlacesMessage/PlacesMessage";

const SystemChatEvent = forwardRef<HTMLDivElement, SystemEvent>((e, ref) => {
  if (e.type === "NEARBY_PLACES_ESTABLISHED") {
    return (
      <div className={css["root"]} ref={ref}>
        <div className={css["message"]}>
          <PlacesMessage places={e.result.places} />
        </div>
      </div>
    );
  }

  return null;
});

export default SystemChatEvent;
