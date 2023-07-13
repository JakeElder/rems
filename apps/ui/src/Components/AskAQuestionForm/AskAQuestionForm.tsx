"use client";

import React from "react";
import css from "./AskAQuestionForm.module.css";
import Button from "../../Elements/Button";
import Textarea from "../../Elements/Textarea";

type Props = {};

const AskAQuestionForm = ({}: Props) => {
  return (
    <form className={css["root"]}>
      <div className={css["textarea"]}>
        <Textarea
          rows={3}
          placeholder="Ask the agent for more information about this property..."
        />
      </div>
      <Button>Ask a question</Button>
    </form>
  );
};

export default AskAQuestionForm;
