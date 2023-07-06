import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import css from "./Select.module.css";

type Option = {
  value: string;
  label: string;
};

type Props = Omit<
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
  "value"
> & {
  value: string;
  options: Option[];
};

const lookup = (value: string, options: Option[]) => {
  const v = options.find((o) => o.value === value);
  if (!v) {
    throw new Error();
  }
  return v.label;
};

const Select = ({ options, value, ...props }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["sort"]}>
        <div className={css["trigger"]}>
          <span className={css["selection"]}>{lookup(value, options)}</span>
          <span className={css["icon"]}>
            <FontAwesomeIcon icon={faChevronDown} size="xs" />
          </span>
        </div>
        <select className={css["select"]} value={value} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
