"use client";

import React from "react";
import css from "./AskAQuestionForm.module.css";
import Button from "../../Elements/Button";

type Props = {};

const AskAQuestionForm = ({}: Props) => {
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

export default AskAQuestionForm;
