import React from "react";
import * as TG from "@radix-ui/react-toggle-group";
import css from "./ToggleGroup.module.css";

type Toggle = {
  label: string;
  value: string;
};

type Props = {
  defaultValue: string;
  items: Toggle[];
};

const ToggleGroup = ({ items, defaultValue }: Props) => {
  return (
    <TG.Root type="single" defaultValue={defaultValue} className={css["root"]}>
      {items.map((t) => (
        <TG.Item className={css["item"]} value={t.value} key={t.value}>
          {t.label}
        </TG.Item>
      ))}
    </TG.Root>
  );
};

export default ToggleGroup;
