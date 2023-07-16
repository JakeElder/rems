import React from "react";
import css from "./ContactAgentModule.module.css";
import ContactAgentForm from "../ContactAgentForm/ContactAgentForm";
import Monogram from "../../Elements/Monogram";
import { ContactAgentFormData, Property, ServerAction } from "@rems/types";

type Props = {
  uid: Property["uid"];
  commit: ServerAction<ContactAgentFormData>;
};

const ContactAgentModule = ({ uid, commit }: Props) => {
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
        <ContactAgentForm uid={uid} commit={commit} />
      </div>
    </div>
  );
};

export default ContactAgentModule;
