import React from "react";
import css from "./ContactAgentModule.module.css";
import * as ContactForm from "../ContactForm";
import Monogram from "../../Elements/Monogram";
import { Property } from "@rems/types";

type Props = {
  uid: Property["uid"];
  defaultMessage?: string;
};

const ContactAgentModule = ({ uid, defaultMessage }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["header"]}>
        <div className={css["monogram"]}>
          <Monogram height={36} />
        </div>
        <div className={css["copy"]}>
          <div className={css["contact"]}>Contact Agent</div>
          <div className={css["info"]}>
            One of our agents will get back to you as soon as possible
          </div>
        </div>
      </div>
      <div className={css["form"]}>
        <ContactForm.Root uid={uid} defaultMessage={defaultMessage}>
          <ContactForm.Controls />
          <ContactForm.Submit />
        </ContactForm.Root>
      </div>
    </div>
  );
};

export default ContactAgentModule;
