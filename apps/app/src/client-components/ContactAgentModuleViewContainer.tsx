"use client";

import React from "react";
import { ContactAgentModule } from "@rems/ui";
import useContactForm from "../hooks/use-contact-form";
import { submitContactForm } from "../app/actions";

type Props = Pick<
  React.ComponentProps<typeof ContactAgentModule>,
  "uid" | "defaultMessage"
>;

const ContactAgentModuleViewContainer = ({ defaultMessage, uid }: Props) => {
  const { onSubmit, isSubmitting } = useContactForm(submitContactForm);
  return (
    <ContactAgentModule
      uid={uid}
      defaultMessage={defaultMessage}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default ContactAgentModuleViewContainer;
