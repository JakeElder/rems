import React, { ReactNode } from "react";
import css from "./StandardHeroLayout.module.css";
import Header from "../../Components/Header/Header";

type Props = {
  hero: ReactNode;
  children: ReactNode;
};

const StandardHeroLayout = ({ hero, children }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["header"]}>
        <Header theme="light" />
      </div>
      <div className={css["hero"]}>{hero}</div>
      <div className={css["content"]}>{children}</div>
    </div>
  );
};

export default StandardHeroLayout;
