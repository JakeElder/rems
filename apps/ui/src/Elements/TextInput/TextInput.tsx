import React from "react";
import css from "./TextInput.module.css";
import cn from "classnames";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  stretch?: boolean;
};

const TextInput = ({ stretch = true, ...props }: Props) => {
  return (
    <input
      className={cn(css["root"], { [css["stretch"]]: stretch })}
      type="text"
      {...props}
    />
  );
};

export default TextInput;
