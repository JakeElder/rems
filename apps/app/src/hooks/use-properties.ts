import useSWR from "swr";
import useRealEstateQuery from "./use-real-estate-query";
import qs from "query-string";
import { GetPropertiesResult } from "@rems/types";

type UsePropertiesHook = (props?: { limit: boolean }) => {
  data: GetPropertiesResult | undefined;
  isLoading: boolean;
};

const fetcher = async (query: string): Promise<GetPropertiesResult> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_REMS_API_URL}/properties${query}`
  );
  const json = await res.json();
  return json;
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
    ([q]) => fetcher(`?${q}`),
    { keepPreviousData: true }
  );

  return { data, isLoading };
};

export default useProperties;
