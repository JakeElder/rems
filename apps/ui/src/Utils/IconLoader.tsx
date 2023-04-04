import { ReactNode } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

type Props = { children: ReactNode };

const IconLoader = ({ children }: Props) => {
  return <>{children}</>;
};

export default IconLoader;
