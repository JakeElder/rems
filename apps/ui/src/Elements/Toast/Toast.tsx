import React from "react";
import css from "./Toast.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
  title?: string;
  children: React.ReactNode;
  handleClose: () => void;
};

const Toast = ({ title, children, handleClose }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["title-and-message"]}>
        {title && <div className={css["title"]}>{title}</div>}
        <div className={css["message"]}>{children}</div>
      </div>
      <span
        className={css["close"]}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </span>
    </div>
  );
};

export default Toast;
