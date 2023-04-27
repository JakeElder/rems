import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

type Props = { children: React.ReactNode };

const IconLoader = ({ children }: Props) => {
  return <>{children}</>;
};

export default IconLoader;
