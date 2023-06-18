import React from "react";
import css from "./Container.module.css";

type Props = {
  children: React.ReactNode;
  full?: boolean;
};

const Container = ({ children, full = false }: Props) => {
  return <div className={css[full ? "root-full" : "root"]}>{children}</div>;
};

export default Container;
