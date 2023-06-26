import React from "react";
import css from "./CheckboxGrid.module.css";

type Props = {
  items: React.ReactNode[];
};

const CheckboxGrid = ({ items }: Props) => {
  return (
    <div className={css["root"]}>
      {items.map((t) => (
        <div className={css["checkbox"]}>{t}</div>
      ))}
    </div>
  );
};

export default CheckboxGrid;
