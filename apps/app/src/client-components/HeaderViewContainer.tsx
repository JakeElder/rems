"use client";

import React, { useState } from "react";
import { ContactModal, Header, SlideNav } from "@rems/ui";

type Props = Pick<React.ComponentProps<typeof Header.Root>, "full" | "mode">;

const HeaderViewContainer = (props: Props) => {
  const [slideNavOpen, setSlideNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <SlideNav
        open={slideNavOpen}
        onOpenChange={setSlideNavOpen}
        onContactUsClick={() => setContactOpen(true)}
      />
      <ContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        onMessageSent={() => setTimeout(() => setContactOpen(false), 2000)}
      />
      <Header.Root
        {...props}
        onContactUsClick={() => setContactOpen(true)}
        onNavIconClick={() => setSlideNavOpen(true)}
      >
        <Header.Main />
      </Header.Root>
    </>
  );
};

export default HeaderViewContainer;
