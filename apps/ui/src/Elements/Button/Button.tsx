import React, { MouseEventHandler } from "react";
import cn from "classnames";
import css from "./Button.module.css";

type Props = {
  children: React.ReactNode;
  secondary?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

const Button = ({
  children,
  secondary = false,
  onClick = () => {},
  type = "button",
  disabled = false
}: Props) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={cn({
        [css["primary"]]: !secondary,
        [css["secondary"]]: secondary
      })}
    >
      {children}
    </button>
  );
};

export default Button;
