import React, { MouseEventHandler } from "react";
import cn from "classnames";
import css from "./Button.module.css";
import { Oval } from "react-loader-spinner";

type Props = {
  children: React.ReactNode;
  loading?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

const Button = ({
  children,
  loading,
  secondary = false,
  onClick = () => {},
  type = "button",
  disabled = false
}: Props) => {
  return (
    <button
      disabled={loading || disabled}
      type={type}
      onClick={onClick}
      className={cn({
        [css["primary"]]: !secondary,
        [css["secondary"]]: secondary
      })}
    >
      {loading ? (
        <Oval height={22} width={22} color="#aaa" secondaryColor="#aaa" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
