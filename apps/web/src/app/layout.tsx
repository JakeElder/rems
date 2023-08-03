import "the-new-css-reset/css/reset.css";
import "../globals.css";
import { FontLoader, IconLoader } from "@rems/ui";

export const metadata = {
  title: "JYO Property",
  description: "Luxury Real Estate",
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
        <IconLoader>
          <FontLoader>{children}</FontLoader>
        </IconLoader>
      </body>
    </html>
  );
}
