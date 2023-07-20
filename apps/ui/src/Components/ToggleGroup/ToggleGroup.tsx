"use client";

import React from "react";
import * as TG from "@radix-ui/react-toggle-group";
import cn from "classnames";
import css from "./ToggleGroup.module.css";

type Props = Omit<TG.ToggleGroupSingleProps, "type"> & {
  items: Toggle[];
  width?: number;
};

type Toggle = {
  label: string;
  value: string;
};

const ToggleGroup = ({ items, width, ...props }: Props) => {
  return (
    <TG.Root
      {...props}
      type="single"
      className={cn({
        [css["root"]]: !width,
        [css["root-fixed"]]: width
      })}
    >
      {items.map((t) => (
        <TG.Item
          className={css["item"]}
          value={t.value}
          key={t.value}
          style={{ ...(width ? { width: `${width}px` } : {}) }}
        >
          {t.label}
        </TG.Item>
      ))}
    </TG.Root>
  );
};

export default ToggleGroup;
