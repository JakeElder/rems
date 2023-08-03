import { Footer } from "@rems/ui";
import fetch from "@/fetch";

type Props = Pick<React.ComponentProps<typeof Footer>, "full">;

const FooterContainer = async ({ full }: Props) => {
  const [{ lineUrl, facebookUrl, linkedInUrl, instagramUrl }, searches] =
    await Promise.all([fetch("app-config"), fetch("popular-searches")]);

  return (
    <Footer
      full={full}
      popularSearches={searches.map((s) => ({ children: s.name, href: "#" }))}
      lineURL={lineUrl || "#"}
      facebookURL={facebookUrl || "#"}
      linkedInURL={linkedInUrl || "#"}
      instagramURL={instagramUrl || "#"}
    />
  );
};

export default FooterContainer;
