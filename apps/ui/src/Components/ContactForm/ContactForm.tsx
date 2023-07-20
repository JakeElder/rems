"use client";

import React, { createContext } from "react";
import css from "./ContactForm.module.css";
import Button from "../../Elements/Button";
import TextInput from "../../Elements/TextInput/TextInput";
import Textarea from "../../Elements/Textarea/Textarea";
import { Property } from "@rems/types";
import { useToast } from "../ToastHub";

type Props = {
  uid?: Property["uid"];
  children: React.ReactNode;
  defaultMessage?: string;
  onMessageSent?: () => void;
  mode?: "contact" | "question";
};

type ContactFormContext = {
  uid?: Property["uid"];
  defaultMessage?: string;
  mode: Props["mode"];
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
  children,
  uid,
  defaultMessage,
  onMessageSent,
  mode = "contact"
}: Props) => {
  const { message } = useToast();

  return (
    <Context.Provider value={{ uid, defaultMessage, mode }}>
      <form
        className={css["root"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          console.log(data);
          message({
            message: data.get("name")?.toString()
          });
          // const res = await sa.commit(
          //   Object.fromEntries(data) as ContactFormData
          // );
          // if (res.ok) {
          //   onMessageSent?.();
          //   message({
          //     title: "Message Sent",
          //     message:
          //       "One of our agents will get back to you as soon as possible.",
          //     timeout: 5000
          //   });
          // }
        }}
      >
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
  const { mode } = useContext();
  return (
    <div className={css["control"]}>
      <Button type="submit" loading={false} fit>
        Send {mode === "question" ? "Question" : "Message"}
      </Button>
    </div>
  );
};
