"use client";

import React from "react";
import css from "./ContactAgentForm.module.css";
import Button from "../../Elements/Button";
import TextInput from "../../Elements/TextInput/TextInput";
import Textarea from "../../Elements/Textarea/Textarea";

type Props = {};

const ContactAgentForm = ({}: Props) => {
  return (
    <form className={css["root"]}>
      <div className={css["control"]}>
        <TextInput name="name" placeholder="Your Name" />
      </div>
      <div className={css["control"]}>
        <TextInput name="email" placeholder="Email" />
      </div>
      <div className={css["control"]}>
        <TextInput name="phone-number" placeholder="Phone (Optional)" />
      </div>
      <div className={css["control"]}>
        <Textarea
          rows={3}
          value="I'm interested in Unique Industrial Bareshell Loft Residence (Bangkok, Krung Thep Maha Nakhon, Thailand)."
        />
      </div>
      <div className={css["control"]}>
        <Button>Send Message</Button>
      </div>
    </form>
  );
};

export default ContactAgentForm;
