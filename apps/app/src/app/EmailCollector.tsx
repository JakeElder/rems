"use client";

import React, { useTransition } from "react";
import { MailingListModule } from "@rems/ui";
import { handleSubmission } from "./actions";

type Props = {};

const EmailCollector = ({}: Props) => {
  const [pending, startTransition] = useTransition();

  return (
    <MailingListModule
      loading={pending}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get("email");
        if (!email) {
          return;
        }
        startTransition(async () => {
          await handleSubmission(email.toString());
        });
      }}
    />
  );
};

export default EmailCollector;
