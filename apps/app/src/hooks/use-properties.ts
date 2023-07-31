import useSWR from "swr";
import useRealEstateQuery from "./use-real-estate-query";
import getProperties from "../utils/get-properties";
import qs from "query-string";
import { GetPropertiesResult } from "@rems/types";

type UsePropertiesHook = (props?: { limit: boolean }) => {
  data: GetPropertiesResult | undefined;
  isLoading: boolean;
};

const useProperties: UsePropertiesHook = (props) => {
  const { serverQuery } = useRealEstateQuery();

  const q = qs.stringify(
    {
      ...serverQuery,
      limit: props?.limit === false ? "false" : "true"
    },
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
