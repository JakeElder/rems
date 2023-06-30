import React from "react";
import css from "./Textarea.module.css";
import cn from "classnames";

type Props = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  stretch?: boolean;
};

const Textarea = ({ stretch = true, ...props }: Props) => {
  return (
    <textarea
      {...props}
      className={cn(css["root"], {
        [css["stretch"]]: stretch
      })}
    />
  );
};

export default Textarea;
