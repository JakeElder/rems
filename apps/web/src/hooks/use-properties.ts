import useSWR from "swr";
import qs from "query-string";
import { GetPropertiesResult, ServerRealEstateQuery } from "@rems/types";

type UsePropertiesHook = (query: ServerRealEstateQuery) => {
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

const useProperties: UsePropertiesHook = (query) => {
  const q = qs.stringify(query, { arrayFormat: "bracket" });

  const { data, isLoading } = useSWR(
    [q, "properties"],
    ([q]) => fetcher(`?${q}`),
    { keepPreviousData: true }
  );

  return { data, isLoading };
};

export default useProperties;
