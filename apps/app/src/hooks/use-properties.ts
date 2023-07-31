import useSWR from "swr";
import useRealEstateQuery from "./use-real-estate-query";
import getProperties from "../utils/get-properties";
import qs from "query-string";
import useRealEstateIndexPageState from "./use-real-estate-index-page-state";
import { ServerRealEstateQuerySchema } from "@rems/schemas";
import { GetPropertiesResult, PartialServerRealEstateQuery } from "@rems/types";

type UsePropertiesHook = (props?: { limit: boolean }) => {
  data: GetPropertiesResult | undefined;
  isLoading: boolean;
};

const useProperties: UsePropertiesHook = (props) => {
  const { query } = useRealEstateQuery();
  const { mapBounds } = useRealEstateIndexPageState();

  const b = mapBounds.get();

  const bounds: PartialServerRealEstateQuery = b
    ? {
        "map-bound-sw-lng": b.sw.lng,
        "map-bound-sw-lat": b.sw.lat,
        "map-bound-ne-lng": b.ne.lng,
        "map-bound-ne-lat": b.ne.lat
      }
    : {};

  const q = qs.stringify(
    ServerRealEstateQuerySchema.parse({
      ...query,
      ...bounds,
      limit: props?.limit === false ? "false" : "true"
    }),
    { arrayFormat: "bracket" }
  );

  const { data, isLoading } = useSWR(
    [q, "properties"],
    ([q]) => getProperties(`?${q}`),
    { keepPreviousData: true }
  );

  return { data, isLoading };
};

export default useProperties;
