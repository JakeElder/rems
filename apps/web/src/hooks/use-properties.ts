import useSWR from "swr";
import qs from "qs";
import { GetPropertiesResult, RealEstateQuery } from "@rems/types";
import { useEffect, useState } from "react";

type UsePropertiesHook = (query: RealEstateQuery) =>
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
  const q = qs.stringify(query, { arrayFormat: "brackets" });
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

  if (!data) {
    return { ready: false, isLoading: true };
  }

  return { ready: true, data, isLoading };
};

export default useProperties;
