import useSWR from "swr";
import qs from "query-string";
import { GetPropertiesResult, ServerRealEstateQuery } from "@rems/types";
import { useEffect, useState } from "react";

type UsePropertiesHook = (query: ServerRealEstateQuery) =>
  | {
      ready: false;
      isLoading: true;
      data: undefined;
    }
  | {
      ready: true;
      isLoading: boolean;
      data: GetPropertiesResult;
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
  const [ready, setReady] = useState(false);

  const { data, isLoading } = useSWR(
    [q, "properties"],
    ([q]) => fetcher(`?${q}`),
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (!ready && !isLoading) {
      setReady(true);
    }
  }, [isLoading]);

  if (ready && data) {
    return { ready: true, data, isLoading };
  }

  return { ready: false, isLoading: true };
};

export default useProperties;
