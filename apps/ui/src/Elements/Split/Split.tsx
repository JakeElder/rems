import React from "react";
import css from "./Split.module.css";

type Props = {
  children: React.ReactNode;
  gap?: number;
};

const Split = ({ children, gap = 12 }: Props) => {
  return (
    <div className={css["root"]} style={{ gap }}>
      {children}
    </div>
  );
};

export default Split;
