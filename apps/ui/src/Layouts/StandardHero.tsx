import React, { ReactNode } from "react";
import css from "./StandardHero.module.css";

type Props = {
  hero: ReactNode;
  children: ReactNode;
};

const StandardHero = ({ hero, children }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["hero"]}>{hero}</div>
      <div className={css['content']}>{children}</div>
    </div>
  );
};

export default StandardHero;
