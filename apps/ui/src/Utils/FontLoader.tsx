"use client";

import React, { PropsWithChildren } from "react";
import cn from "classnames";
import { Inter, Libre_Baskerville } from "@next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-libre"
});

type Props = PropsWithChildren<{}>;

const FontLoader = ({ children }: Props) => {
  return (
    <div className={cn(inter.variable, libre.variable)}>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-libre: ${libre.style.fontFamily};
        }
      `}</style>
      {children}
    </div>
  );
};

export default FontLoader;
