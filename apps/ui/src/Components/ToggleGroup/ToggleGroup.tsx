import React from "react";
import * as TG from "@radix-ui/react-toggle-group";
import css from "./ToggleGroup.module.css";

type Toggle = {
  label: string;
  value: string;
};

type Props = { toggles: Toggle[] };

const ToggleGroup = ({ toggles }: Props) => {
  return (
    <TG.Root type="single" className={css["root"]}>
      {toggles.map((t) => (
        <TG.Item key={t.value} className={css["item"]} value={t.value}>
          {t.label}
        </TG.Item>
      ))}
    </TG.Root>
  );
};

export default ToggleGroup;
