"use client";

import { MutableRefObject, createContext, useRef } from "react";

type Props = {
  children: React.ReactNode;
};

type Context = {
  $header: MutableRefObject<HTMLDivElement | null>;
  $listings: MutableRefObject<HTMLDivElement | null>;
  $chatInput: MutableRefObject<HTMLInputElement | null>;
};

export const DomElementsContext = createContext<Context | null>(null);

const DomElementsProvider = ({ children }: Props) => {
  const $header = useRef<HTMLDivElement | null>(null);
  const $listings = useRef<HTMLDivElement | null>(null);
  const $chatInput = useRef<HTMLInputElement | null>(null);

  return (
    <DomElementsContext.Provider
      value={{
        $header,
        $listings,
        $chatInput
      }}
    >
      {children}
    </DomElementsContext.Provider>
  );
};

export default DomElementsProvider;
