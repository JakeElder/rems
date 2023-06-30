import React from "react";
import css from "./TextInput.module.css";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const TextInput = (props: Props) => {
  return <input type="text" {...props} />;
};

export default TextInput;
