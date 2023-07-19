import React from "react";
import css from "./Container.module.css";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  full?: boolean;
};

const Container = ({ full = false, ...props }: Props) => {
  return <div className={css[full ? "root-full" : "root"]} {...props} />;
};

export default Container;
