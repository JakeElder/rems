"use client";

import React, { useState } from "react";
import { MailingListModule, useToast } from "@rems/ui";
import { submitMailingListForm } from "../../app/actions";

type Props = {};

const MailingListModuleViewContainer = ({}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message } = useToast();

  return (
    <MailingListModule
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = form.get("email")!.toString();
        setIsSubmitting(true);
        await submitMailingListForm({ email });
        message({
          title: "Mailing List Joined!",
          message: (
            <>
              We've added <span style={{ fontWeight: 600 }}>{email}</span> to
              our mailing list
            </>
          ),
          timeout: 5000
        });
        setIsSubmitting(false);
      }}
      isSubmitting={isSubmitting}
    />
  );
};

export default MailingListModuleViewContainer;
