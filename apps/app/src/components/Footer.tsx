import React from "react";
import { Footer as FooterView } from "@rems/ui";
import api from "../api";

type Props = { full?: boolean };

const Footer = async ({ full = false }: Props) => {
  const [{ lineURL, facebookURL, linkedInURL, instagramURL }, searches] =
    await Promise.all([api.get.appConfig(), api.get.popularSearches()]);

  return (
    <FooterView
      full={full}
      popularSearches={searches.map((s) => ({ children: s.name, href: "#" }))}
      lineURL={lineURL || "#"}
      facebookURL={facebookURL || "#"}
      linkedInURL={linkedInURL || "#"}
      instagramURL={instagramURL || "#"}
    />
  );
};

export default Footer;
