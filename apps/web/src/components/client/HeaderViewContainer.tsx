"use client";

import React, { useState } from "react";
import { ContactModal, Header, SlideNav } from "@rems/ui";
import HeaderChatInputContainer from "./HeaderChatInputContainer";
import useContactForm from "@/hooks/use-contact-form";
import useDomElements from "@/hooks/use-dom-elements";

type Props = Pick<React.ComponentProps<typeof Header.Root>, "full" | "mode"> & {
  chat?: boolean;
};

const HeaderViewContainer = ({ chat, ...props }: Props) => {
  const [slideNavOpen, setSlideNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const { isSubmitting, onSubmit } = useContactForm(
    (body) => fetch("/api/contact-form", { method: "POST", body }),
    () => setTimeout(() => setContactOpen(false), 2000)
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
      <Header.Main>
        <Header.Logo />
        <Header.ChatInput>
          {chat ? <HeaderChatInputContainer /> : null}
        </Header.ChatInput>
        <Header.NavAndContact />
      </Header.Main>
    </Header.Root>
  ];
};

export default HeaderViewContainer;
