import React, { PropsWithChildren } from "react";
import cn from "classnames";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

// export const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter"
// });

export const inter = localFont({
  src: [
    {
      path: "../assets/fonts/Calibre/TestCalibre-Light.otf",
      weight: "300",
      style: "normal"
    },
    {
      path: "../assets/fonts/Calibre/TestCalibre-Regular.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../assets/fonts/Calibre/TestCalibre-Medium.otf",
      weight: "500",
      style: "normal"
    }
  ],
  display: "swap",
  variable: "--font-inter"
});

const newzald = localFont({
  src: "../assets/fonts/Newzald/TestNewzald-Book.otf",
  display: "swap",
  variable: "--font-libre"
});

// export const libre = Libre_Baskerville({
//   subsets: ["latin"],
//   weight: "400",
//   variable: "--font-libre"
// });

type Props = PropsWithChildren<{}>;

const FontLoader = ({ children }: Props) => {
  return <div className={cn(inter.variable, newzald.variable)}>{children}</div>;
};

export default FontLoader;
