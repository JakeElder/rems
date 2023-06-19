import React from "react";
import * as RadixToggle from "@radix-ui/react-toggle";
import css from "./Toggle.module.css";

type Props = { children: React.ReactNode };

const Toggle = ({ children }: Props) => {
  return (
    <RadixToggle.Root className={css["root"]}>{children}</RadixToggle.Root>
  );
};

export default Toggle;
