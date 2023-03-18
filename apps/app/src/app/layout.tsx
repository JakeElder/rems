import "the-new-css-reset";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
