import React from "react";
import css from "./Dialog.module.css";

export const Root = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["root"]}>{children}</div>;
};

export const Header = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["header"]}>{children}</div>;
};

export const Main = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["main"]}>{children}</div>;
};

export const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["footer"]}>{children}</div>;
};
