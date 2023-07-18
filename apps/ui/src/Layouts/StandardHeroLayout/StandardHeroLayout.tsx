import React from "react";
import css from "./StandardHeroLayout.module.css";
import { RemoveScroll } from "react-remove-scroll";
import cn from "classnames";

export const Root = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["root"]}>{children}</div>;
};

export const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={cn(css["header"], RemoveScroll.classNames.zeroRight)}>
      {children}
    </div>
  );
};

export const Hero = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["hero"]}>{children}</div>;
};

export const Content = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["content"]}>{children}</div>;
};
