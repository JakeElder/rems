"use client";

import React, { createContext } from "react";
import css from "./ContactForm.module.css";
import Button from "../../Elements/Button";
import TextInput from "../../Elements/TextInput/TextInput";
import Textarea from "../../Elements/Textarea/Textarea";
import { Property } from "@rems/types";

type Props = {
  uid?: Property["uid"];
  children: React.ReactNode;
  defaultMessage?: string;
  mode?: "contact" | "question";
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
};

type ContactFormContext = {
  uid?: Property["uid"];
  defaultMessage?: string;
  mode: Props["mode"];
  isSubmitting: Props["isSubmitting"];
};

const Context = createContext<ContactFormContext | null>(null);

const useContext = () => {
  const ctx = React.useContext(Context);
  if (ctx === null) {
    throw new Error();
  }
  return ctx;
};

export const Root = ({
  uid,
  children,
  defaultMessage,
  mode = "contact",
  onSubmit,
  isSubmitting
}: Props) => {
  return (
    <Context.Provider value={{ uid, defaultMessage, mode, isSubmitting }}>
      <form className={css["root"]} onSubmit={onSubmit}>
        {children}
      </form>
    </Context.Provider>
  );
};

export const Controls = () => {
  const { uid, defaultMessage, mode } = useContext();
  return (
    <>
      <input type="hidden" name="uid" value={uid ? uid : undefined} />
      <div className={css["control"]}>
        <TextInput name="name" placeholder="Your Name" required />
      </div>
      <div className={css["control"]}>
        <TextInput type="email" name="email" placeholder="Email" required />
      </div>
      <div className={css["control"]}>
        <TextInput name="phone-number" placeholder="Phone (Optional)" />
      </div>
      <div className={css["control"]}>
        <Textarea
          name="message"
          rows={3}
          placeholder={`Your ${mode === "question" ? "Question" : "Message"}`}
          defaultValue={defaultMessage}
        />
      </div>
    </>
  );
};

export const Submit = () => {
  const { mode, isSubmitting } = useContext();
  return (
    <div className={css["control"]}>
      <Button type="submit" loading={isSubmitting} fit>
        Send {mode === "question" ? "Question" : "Message"}
      </Button>
    </div>
  );
};
