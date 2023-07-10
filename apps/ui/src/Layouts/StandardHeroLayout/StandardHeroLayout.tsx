import React from "react";
import css from "./StandardHeroLayout.module.css";

export const Root = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["root"]}>{children}</div>;
};

export const Header = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["header"]}>{children}</div>;
};

export const Hero = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["hero"]}>{children}</div>;
};

export const Content = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["content"]}>{children}</div>;
};
