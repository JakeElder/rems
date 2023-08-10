"use client";

import React, { useState } from "react";
import { ContactModal, Footer } from "@rems/ui";
import { AppConfig, FilterSet } from "@rems/types";
import useFilterSet from "@/hooks/use-filter-set";
import useContactForm from "@/hooks/use-contact-form";

type Props = Pick<React.ComponentProps<typeof Footer.Root>, "full"> & {
  config: AppConfig;
  searches: FilterSet[];
};

const PopularSearchViewContainer = ({ search }: { search: FilterSet }) => {
  const set = useFilterSet(search);
  return <Footer.PopularSearch set={set} />;
};

const FooterViewContainer = ({ config, searches, full }: Props) => {
  const [contactOpen, setContactOpen] = useState(false);

  const { isSubmitting, onSubmit } = useContactForm(
    (body) => fetch("/api/contact-form", { method: "POST", body }),
    () => setTimeout(() => setContactOpen(false), 2000)
  );

  return [
    <ContactModal
      key="contact-modal"
      open={contactOpen}
      onOpenChange={setContactOpen}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />,
    <Footer.Root
      key="footer"
      full={full}
      onContactUsClick={() => setContactOpen(true)}
      popularSearches={searches.map((s) => (
        <PopularSearchViewContainer key={s.slug} search={s} />
      ))}
      lineURL={config.lineUrl || "#"}
      facebookURL={config.facebookUrl || "#"}
      linkedInURL={config.linkedInUrl || "#"}
      instagramURL={config.instagramUrl || "#"}
    />
  ];
};

export default FooterViewContainer;
