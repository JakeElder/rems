"use client";

import React from "react";
import cn from "classnames";
import css from "./Button.module.css";
import { Oval } from "react-loader-spinner";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  loading?: boolean;
  secondary?: boolean;
  width?: number;
};

const Button = ({
  children,
  loading,
  secondary = false,
  width,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn({
        [css["primary"]]: !secondary,
        [css["secondary"]]: secondary
      })}
      style={{ ...(width ? { width } : {}) }}
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
