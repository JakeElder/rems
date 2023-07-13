"use client";

import { Property } from "@rems/types";
import React, { createContext, useContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type IndexConnectorContext = {
  setMouseOver: (id: Property["id"]) => void;
  setMouseOut: () => void;
  activeProperty: Property["id"] | null;
};

const IndexConnectorContext = createContext<IndexConnectorContext | null>(null);

export const useIndexConnector = () => {
  const handlers = useContext(IndexConnectorContext);
  if (!handlers) {
    throw new Error();
  }
  return handlers;
};

const IndexConnector = ({ children }: Props) => {
  const [active, setActive] = useState<null | Property["id"]>(null);

  return (
    <IndexConnectorContext.Provider
      value={{
        setMouseOver: (id) => setActive(id),
        setMouseOut: () => setActive(null),
        activeProperty: active
      }}
      children={children}
    />
  );
};

export default IndexConnector;
