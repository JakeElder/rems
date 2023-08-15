import { createContext, useContext, useEffect } from "react";
import useRealEstateQuery from "./use-real-estate-query";
import { Observable } from "@legendapp/state";
import { enableLegendStateReact, useObservable } from "@legendapp/state/react";
import { MapBounds, RealEstateQuery } from "@rems/types";

enableLegendStateReact();

const PersonProvider = createContext<{
  radius: Observable<RealEstateQuery["radius"]>;
  mapBounds: Observable<MapBounds | null>;
} | null>(null);

const useRealEstateIndexPageState = () => useContext(PersonProvider)!;

export const RealEstateIndexPageStateProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { query } = useRealEstateQuery();
  const radius = useObservable(query["radius"]);
  const mapBounds = useObservable<MapBounds | null>(null);

  useEffect(() => {
    radius.set(query["radius"]);
  }, [query["radius"]]);

  return (
    <PersonProvider.Provider
      value={{ radius, mapBounds }}
      children={children}
    />
  );
};

export default useRealEstateIndexPageState;
