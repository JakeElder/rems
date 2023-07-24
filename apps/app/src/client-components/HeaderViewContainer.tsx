"use client";

import React, { useState } from "react";
import { ContactModal, Header, SlideNav } from "@rems/ui";
import { submitContactForm } from "../app/actions";
import useContactForm from "../hooks/use-contact-form";
import AiSearchViewContainer from "./AiSearchViewContainer";

type Props = Pick<React.ComponentProps<typeof Header.Root>, "full" | "mode">;

const AiSearch = () => {
  if (process.env.NEXT_PUBLIC_AI_SEARCH_ENABLED !== "true") {
    return null;
  }

  return (
    <Header.AiSearch>
      <AiSearchViewContainer />
    </Header.AiSearch>
  );
};

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
      <Header.Main>
        <Header.Logo />
        <AiSearch />
        <Header.NavAndContact />
      </Header.Main>
    </Header.Root>
  ];
};

export default HeaderViewContainer;
