"use client";

import React, { useState } from "react";
import css from "./AskAQuestionForm.module.css";
import Button from "../../Elements/Button";
import Textarea from "../../Elements/Textarea";
import ContactModal from "../ContactModal/ContactModal";

type Props = Omit<
  React.ComponentProps<typeof ContactModal>,
  "mode" | "defaultMessage"
>;

const AskAQuestionForm = ({ open, onOpenChange, ...props }: Props) => {
  const [value, setValue] = useState("");

  return (
    <div className={css["root"]}>
      <ContactModal
        {...props}
        defaultMessage={value}
        open={open}
        onOpenChange={onOpenChange}
        mode="question"
      />
      <div className={css["textarea"]}>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          rows={3}
          placeholder="Ask the agent for more information about this property..."
        />
      </div>
      <Button onClick={() => onOpenChange?.(true)} fit>
        Ask a question
      </Button>
    </div>
  );
};

export default AskAQuestionForm;
