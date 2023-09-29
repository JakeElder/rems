import React from "react";
import css from "./PatchMessage.module.css";
import { Patch as PatchType } from "@rems/types";
import { titleCase } from "title-case";
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
        <div className={css["group"]}>
          {titleCase(patch.group.replace(/_/g, " ").toLowerCase())}
        </div>
      </div>
      <div className={css["body"]}>
        <Patch {...patch} />
      </div>
    </div>
  );
};

export default PatchMessage;
