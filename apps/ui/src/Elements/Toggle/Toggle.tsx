"use client";

import React, { ComponentProps } from "react";
import * as RadixToggle from "@radix-ui/react-toggle";
import css from "./Toggle.module.css";
import Outline from "../Outline";

type Props = ComponentProps<typeof RadixToggle.Root>;

const Toggle = ({ children, ...props }: Props) => {
  return (
    <RadixToggle.Root {...props}>
      <Outline on={props.pressed}>
        <div className={css["root"]}>{children}</div>
      </Outline>
    </RadixToggle.Root>
  );
};

export default Toggle;
