import React from "react";
import css from "./ContactAgentForm.module.css";
import Button from "../../Elements/Button";

type Props = {};

const ContactAgentForm = ({}: Props) => {
  return (
    <form className={css["root"]}>
      <textarea
        className={css["textarea"]}
        rows={3}
        placeholder="Ask the agent for more information about this property..."
      />
      <Button>Ask a question</Button>
    </form>
  );
};

export default ContactAgentForm;
