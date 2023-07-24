"use client";

import React, { useState } from "react";
import { AskAQuestionForm } from "@rems/ui";
import useContactForm from "../hooks/use-contact-form";
import { submitContactForm } from "../app/actions";

type Props = Pick<React.ComponentProps<typeof AskAQuestionForm>, "uid">;

const AskAQuestionFormViewContainer = ({ uid }: Props) => {
  const [open, setOpen] = useState(false);
  const { isSubmitting, onSubmit } = useContactForm(submitContactForm, () =>
    setTimeout(() => setOpen(false), 2000)
  );
  return (
    <AskAQuestionForm
      uid={uid}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      open={open}
      onOpenChange={setOpen}
    />
  );
};

export default AskAQuestionFormViewContainer;
