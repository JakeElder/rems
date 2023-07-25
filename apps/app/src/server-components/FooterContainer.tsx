import { Footer } from "@rems/ui";
import api from "../api";

type Props = Pick<React.ComponentProps<typeof Footer>, "full">;

const FooterContainer = async ({ full }: Props) => {
  const [{ lineURL, facebookURL, linkedInURL, instagramURL }, searches] =
    await Promise.all([api.get.appConfig(), api.get.popularSearches()]);

  return (
    <Footer
      full={full}
      popularSearches={searches.map((s) => ({ children: s.name, href: "#" }))}
      lineURL={lineURL || "#"}
      facebookURL={facebookURL || "#"}
      linkedInURL={linkedInURL || "#"}
      instagramURL={instagramURL || "#"}
    />
  );
};

export default FooterContainer;
