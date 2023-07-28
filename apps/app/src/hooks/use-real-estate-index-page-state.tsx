import { createContext, useContext, useEffect } from "react";
import useRealEstateQuery from "./use-real-estate-query";
import { Observable } from "@legendapp/state";
import { enableLegendStateReact, useObservable } from "@legendapp/state/react";

enableLegendStateReact();

const PersonProvider = createContext<{
  radius: Observable<number>;
} | null>(null);

const useRealEstateIndexPageState = () => useContext(PersonProvider)!;

export const RealEstateIndexPageStateProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { query } = useRealEstateQuery();
  const radius = useObservable(query["search-radius"]);

  useEffect(() => {
    radius.set(query["search-radius"]);
  }, [query["search-radius"]]);

  return <PersonProvider.Provider value={{ radius }} children={children} />;
};

export default useRealEstateIndexPageState;
