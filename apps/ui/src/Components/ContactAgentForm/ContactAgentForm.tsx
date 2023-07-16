"use client";

import React from "react";
import css from "./ContactAgentForm.module.css";
import Button from "../../Elements/Button";
import TextInput from "../../Elements/TextInput/TextInput";
import Textarea from "../../Elements/Textarea/Textarea";
import { ContactAgentFormData, Property, ServerAction } from "@rems/types";
import useServerAction from "../../hooks/useServerAction";

type Props = {
  uid: Property["uid"];
  commit: ServerAction<ContactAgentFormData>;
};

const ContactAgentForm = ({ uid, commit }: Props) => {
  const sa = useServerAction(commit);

  return (
    <form
      className={css["root"]}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        sa.commit(Object.fromEntries(data) as ContactAgentFormData);
      }}
    >
      <input type="hidden" name="uid" value={uid} />
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
          defaultValue="I'm interested in Unique Industrial Bareshell Loft Residence (Bangkok, Krung Thep Maha Nakhon, Thailand)."
          required
        />
      </div>
      <div className={css["control"]}>
        <Button type="submit" loading={sa.pending}>
          Send Message
        </Button>
      </div>
    </form>
  );
};

export default ContactAgentForm;
