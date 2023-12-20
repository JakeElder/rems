import React from "react";
import css from "./PatchMessage.module.css";
import { Patch as PatchType } from "@rems/state";
import { sentenceCase } from "change-case";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import Patch from "../Patch";

const PatchMessage = (patch: PatchType) => {
  return (
    <div className={css["root"]}>
      <div className={css["heading"]}>
        <div className={css["icon"]}>
          <FontAwesomeIcon icon={faSliders} size="sm" />
        </div>
        <div className={css["group"]}>{sentenceCase(patch.group)}</div>
      </div>
      <div className={css["body"]}>
        <Patch {...patch} />
      </div>
    </div>
  );
};

export default PatchMessage;
