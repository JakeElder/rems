"use client";

import React, { useState } from "react";
import { ContactModal, Header, SlideNav } from "@rems/ui";
import AiSearchViewContainer from "./AiSearchViewContainer";
import useContactForm from "@/hooks/use-contact-form";

type Props = Pick<React.ComponentProps<typeof Header.Root>, "full" | "mode"> & {
  search?: boolean;
};

const HeaderViewContainer = ({ search, ...props }: Props) => {
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
        {false ? (
          <Header.AiSearch>
            <AiSearchViewContainer />
          </Header.AiSearch>
        ) : null}
        <Header.NavAndContact />
      </Header.Main>
    </Header.Root>
  ];
};

export default HeaderViewContainer;
