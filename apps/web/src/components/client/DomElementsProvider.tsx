"use client";

import { MutableRefObject, createContext, useContext, useRef } from "react";

type Props = {
  children: React.ReactNode;
};

type Context = {
  $header: MutableRefObject<HTMLDivElement | null>;
  $listings: MutableRefObject<HTMLDivElement | null>;
};

const DomElementsContext = createContext<Context | null>(null);
export const useDomElements = () => useContext(DomElementsContext)!;

const DomElementsProvider = ({ children }: Props) => {
  const $header = useRef<HTMLDivElement | null>(null);
  const $listings = useRef<HTMLDivElement | null>(null);

  return (
    <DomElementsContext.Provider value={{ $header, $listings }}>
      {children}
    </DomElementsContext.Provider>
  );
};

export default DomElementsProvider;
