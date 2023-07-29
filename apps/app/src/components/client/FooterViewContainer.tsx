"use client";

import React from "react";
import { Footer } from "@rems/ui";
import { AppConfig, FilterSet } from "@rems/types";

type Props = Pick<React.ComponentProps<typeof Footer>, "full"> & {
  config: AppConfig;
  searches: FilterSet[];
};

const FooterViewContainer = ({ config, searches, full }: Props) => {
  return (
    <Footer
      full={full}
      popularSearches={searches.map((s) => ({ children: s.name, href: "#" }))}
      lineURL={config.lineURL || "#"}
      facebookURL={config.facebookURL || "#"}
      linkedInURL={config.linkedInURL || "#"}
      instagramURL={config.instagramURL || "#"}
    />
  );
};

export default FooterViewContainer;
