"use client";

import React, { useState } from "react";
import css from "./AskAQuestionForm.module.css";
import Button from "../../Elements/Button";
import Textarea from "../../Elements/Textarea";
import ContactModal from "../ContactModal/ContactModal";
import { Property } from "@rems/types";

type Props = {
  uid?: Property["uid"];
};

const AskAQuestionForm = ({ uid }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className={css["root"]}>
      <ContactModal
        defaultMessage={value}
        open={open}
        onOpenChange={(open) => setOpen(open)}
        onMessageSent={() => setTimeout(() => setOpen(false), 2000)}
        mode="question"
        uid={uid}
      />
      <div className={css["textarea"]}>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          rows={3}
          placeholder="Ask the agent for more information about this property..."
        />
      </div>
      <Button onClick={() => setOpen(true)}>Ask a question</Button>
    </div>
  );
};

export default AskAQuestionForm;
