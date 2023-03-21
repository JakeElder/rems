import React, { PropsWithChildren } from "react";
import { Inter, Libre_Baskerville } from "@next/font/google";
import cn from "classnames";

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
  return <div className={cn(inter.variable, libre.variable)}>{children}</div>;
};

export default FontLoader;
