import React, { ComponentProps } from "react";
import * as CB from "@radix-ui/react-checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import css from "./Checkbox.module.css";

type Props = ComponentProps<typeof CB.Root> & {
  label: string;
};

const Checkbox = ({ label, name, value, ...props }: Props) => {
  return (
    <div className={css["root"]}>
      <CB.Root className={css["checkbox"]} {...props}>
        <CB.Indicator className="CheckboxIndicator">
          <FontAwesomeIcon icon={faCheck} className={css["check"]} size="xs" />
        </CB.Indicator>
      </CB.Root>
      <label className={css["label"]} htmlFor={props.id}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
