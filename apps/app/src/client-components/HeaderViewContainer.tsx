"use client";

import React, { useState } from "react";
import { ContactModal, Header, SlideNav } from "@rems/ui";
// import { submitContactForm } from "../app/actions";
import AiSearchViewContainer from "./AiSearchViewContainer";
import useContactForm from "../hooks/use-contact-form";

type Props = Pick<React.ComponentProps<typeof Header.Root>, "full" | "mode"> & {
  search?: boolean;
};

const AiSearch = ({ show }: { show?: boolean }) => {
  if (process.env.NEXT_PUBLIC_AI_SEARCH_ENABLED !== "true" || !show) {
    return null;
  }

  return (
    <Header.AiSearch>
      <AiSearchViewContainer />
    </Header.AiSearch>
  );
};

const HeaderViewContainer = ({ search, ...props }: Props) => {
  const [slideNavOpen, setSlideNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const { isSubmitting, onSubmit } = useContactForm(
    () => Promise.resolve({}),
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
        <AiSearch show={search} />
        <Header.NavAndContact />
      </Header.Main>
    </Header.Root>
  ];
};

export default HeaderViewContainer;
