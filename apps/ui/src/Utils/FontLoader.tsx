import React, { PropsWithChildren } from "react";
import cn from "classnames";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

// import tcl from "../assets/fonts/calibre/test-calibre-light.woff2";
// console.log(tcl);

// export const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter"
// });

export const inter = localFont({
  src: [
    {
      path: "../assets/fonts/calibre/test-calibre-light.woff2",
      weight: "300",
      style: "normal"
    },
    {
      path: "../assets/fonts/calibre/test-calibre-regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "../assets/fonts/calibre/test-calibre-medium.woff2",
      weight: "500",
      style: "normal"
    }
  ],
  variable: "--font-inter"
});

const newzald = localFont({
  src: "../assets/fonts/newzald/test-newzald-book.woff2",
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
