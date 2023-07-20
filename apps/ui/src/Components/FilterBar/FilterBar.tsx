import React from "react";
import css from "./FilterBar.module.css";
import Container from "../../Elements/Container/Container";

export const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={css["root"]}>
      <Container full>
        <div className={css["sections"]}>{children}</div>
      </Container>
    </div>
  );
};

export const FilterDialog = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["filters"]}>{children}</div>;
};

export const KeyFilters = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["key-filters"]}>{children}</div>;
};

export const QuickFilters = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["toggles"]}>{children}</div>;
};

export const Separator = () => {
  return <div className={css["separator"]} />;
};
