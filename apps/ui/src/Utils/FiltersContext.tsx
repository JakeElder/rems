"use client";

import { Filters } from "@rems/types";
import { createContext, useContext } from "react";

const FiltersContext = createContext<Filters | null>(null);

export const useFilters = () => {
  const filters = useContext(FiltersContext);
  if (filters === null) {
    throw new Error();
  }
  return filters;
};

const Provider = (
  props: React.ComponentProps<typeof FiltersContext.Provider>
) => {
  return <FiltersContext.Provider {...props} />;
};

export default Provider;
