"use client";

import React, { useState } from "react";
import { ContactModal, Header, SlideNav } from "@rems/ui";
import { submitContactForm } from "../app/actions";
import useContactForm from "../hooks/use-contact-form";

type Props = Pick<React.ComponentProps<typeof Header.Root>, "full" | "mode">;

const HeaderViewContainer = (props: Props) => {
  const [slideNavOpen, setSlideNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const { isSubmitting, onSubmit } = useContactForm(submitContactForm, () =>
    setTimeout(() => setContactOpen(false), 2000)
  );

  return [
    <SlideNav
      key="slide-nav"
      open={slideNavOpen}
      onOpenChange={setSlideNavOpen}
      onContactUsClick={() => setContactOpen(true)}
    />,
    <ContactModal
      key="contact-modal"
      open={contactOpen}
      onOpenChange={setContactOpen}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />,
    <Header.Root
      key="header"
      {...props}
      onContactUsClick={() => setContactOpen(true)}
      onNavIconClick={() => setSlideNavOpen(true)}
    >
      <Header.Main />
    </Header.Root>
  ];
};

export default HeaderViewContainer;
