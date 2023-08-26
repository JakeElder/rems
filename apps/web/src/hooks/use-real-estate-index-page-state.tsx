import { createContext, useContext, useEffect } from "react";
import useRealEstateQuery from "./use-real-estate-query";
import { Observable } from "@legendapp/state";
import { useObservable } from "@legendapp/state/react";
import { MapBounds, RealEstateQuery } from "@rems/types";

const IndexPageStateProvider = createContext<{
  radius: Observable<RealEstateQuery["radius"]>;
  mapBounds: Observable<MapBounds | null>;
} | null>(null);

const useRealEstateIndexPageState = () => useContext(IndexPageStateProvider)!;

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
    <IndexPageStateProvider.Provider
      value={{ radius, mapBounds }}
      children={children}
    />
  );
};

export default useRealEstateIndexPageState;
