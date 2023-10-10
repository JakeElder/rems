import "the-new-css-reset/css/reset.css";
import "../globals.css";
import { FontLoader, IconLoader } from "@rems/ui";
import ExternalScripts from "@/components/client/ExternalScripts";

export const metadata = {
  title: "Rems",
  description: "The worlds most advanced AI powered real estate platform",
  icons: "/favicon.svg"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ExternalScripts />
        <IconLoader>
          <FontLoader>{children}</FontLoader>
        </IconLoader>
      </body>
    </html>
  );
}
