import React, { PropsWithChildren } from "react";
import cn from "classnames";
import { Inter, Libre_Baskerville } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-libre"
});

type Props = PropsWithChildren<{}>;

const FontLoader = ({ children }: Props) => {
  return <div className={cn(inter.variable, libre.variable)}>{children}</div>;
};

export default FontLoader;
