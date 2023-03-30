import React, { ReactNode } from "react";
import css from "./StandardHero.module.css";

type Props = {
  hero: ReactNode;
  children: ReactNode;
};

const StandardHero = ({ hero, children }: Props) => {
  return <div className={css["root"]}></div>;
};

export default StandardHero;
