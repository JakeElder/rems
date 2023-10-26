import useSWR from "swr";
import { GetPropertiesResult, RealEstateQuery } from "@rems/types";
import { useEffect, useState } from "react";
import { generateQueryString } from "@rems/utils/query";
import { useRealEstateQuery } from "@/state";

type UsePropertiesHook = () =>
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

const useProperties: UsePropertiesHook = () => {
  const [ready, setReady] = useState(false);
  const query = generateQueryString(useRealEstateQuery());

  const { data, isLoading } = useSWR(
    [query || "?", "properties"],
    ([q]) => fetcher(q),
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (!ready && !isLoading) {
      setReady(true);
    }
  }, [isLoading]);

  if (!data) {
    return { ready: false, isLoading: true };
  }

  return { ready: true, data, isLoading };
};

export default useProperties;
