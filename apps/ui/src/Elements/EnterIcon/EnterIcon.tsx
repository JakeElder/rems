import React from "react";
import css from "./EnterIcon.module.css";

type Props = {};

const EnterIcon = ({}: Props) => {
  return (
    <svg fill="currentColor" viewBox="0 0 16 16" height={12} width={12}>
      <path
        d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"
        fill-rule="evenodd"
      />
    </svg>
  );
};

export default EnterIcon;
