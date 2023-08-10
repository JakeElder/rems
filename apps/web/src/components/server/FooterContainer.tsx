import { Footer } from "@rems/ui";
import fetch from "@/fetch";
import FooterViewContainer from "../client/FooterViewContainer";

type Props = Pick<React.ComponentProps<typeof Footer>, "full">;

const FooterContainer = async ({ full }: Props) => {
  const [config, searches] = await Promise.all([
    fetch("app-config"),
    fetch("popular-searches")
  ]);

  return (
    <FooterViewContainer config={config} full={full} searches={searches} />
  );
};

export default FooterContainer;
