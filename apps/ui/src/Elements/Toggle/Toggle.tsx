import React, { ComponentProps } from "react";
import * as RadixToggle from "@radix-ui/react-toggle";
import css from "./Toggle.module.css";

type Props = ComponentProps<typeof RadixToggle.Root>;

const Toggle = (props: Props) => {
  return <RadixToggle.Root className={css["root"]} {...props} />;
};

export default Toggle;
