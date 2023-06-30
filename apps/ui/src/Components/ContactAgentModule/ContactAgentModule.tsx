import React from "react";
import css from "./ContactAgentModule.module.css";
import ContactAgentForm from "../ContactAgentForm/ContactAgentForm";
import Monogram from "../../Elements/Monogram";

type Props = {};

const ContactAgentModule = ({}: Props) => {
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
        <ContactAgentForm />
      </div>
    </div>
  );
};

export default ContactAgentModule;
