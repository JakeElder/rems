import "the-new-css-reset/css/reset.css";
import "../globals.css";
import type { AppProps } from "next/app";
import { FontLoader, IconLoader } from "@rems/ui";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <IconLoader>
      <FontLoader>
        <Component {...pageProps} />
      </FontLoader>
    </IconLoader>
  );
}
