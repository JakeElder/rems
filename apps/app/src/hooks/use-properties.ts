import useSWR from "swr";
import useRealEstateQuery from "./use-real-estate-query";
import getProperties from "../utils/get-properties";
import qs from "query-string";
import { omit } from "remeda";

const useProperties = () => {
  const { query } = useRealEstateQuery();

  const q = qs.stringify(omit(query, ["map-zoom", "map-lng", "map-lat"]), {
    arrayFormat: "bracket"
  });

  const { data, isLoading } = useSWR(
    [q, "properties"],
    ([q]) => getProperties(`?${q}`),
    { keepPreviousData: true }
  );

  return { data, isLoading };
};

export default useProperties;
