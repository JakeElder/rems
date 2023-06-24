import React from "react";
import * as CB from "@radix-ui/react-checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import css from "./Checkbox.module.css";

type Props = {
  id: string;
  label: string;
};

const Checkbox = ({ id, label }: Props) => {
  return (
    <div className={css["root"]}>
      <CB.Root className={css["checkbox"]} defaultChecked id={id}>
        <CB.Indicator className="CheckboxIndicator">
          <FontAwesomeIcon icon={faCheck} className={css["check"]} size="xs" />
        </CB.Indicator>
      </CB.Root>
      <label className={css["label"]} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
