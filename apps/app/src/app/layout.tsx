import "the-new-css-reset/css/reset.css";
import "./globals.css";
import { FontLoader } from "@rems/ui";

export const metadata = {
  title: "JYO Property",
  description: "Luxury Real Estate"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FontLoader>{children}</FontLoader>
      </body>
    </html>
  );
}
