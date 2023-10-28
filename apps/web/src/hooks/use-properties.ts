import useSWR from "swr";
import {
  ApiRealEstateQuery,
  ApiRealEstateQueryTarget,
  GetPropertiesResult
} from "@rems/types";
import { generateApiQueryString } from "@rems/utils/query";
import { useRealEstateQuery } from "@/state";
import { clone } from "remeda";

const fetcher = async (query: string): Promise<GetPropertiesResult> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_REMS_API_URL}/properties${query}`
  );
  const json = await res.json();
  return json;
};

const useProperties = ({ target }: { target: ApiRealEstateQueryTarget }) => {
  const query: ApiRealEstateQuery = {
    ...clone(useRealEstateQuery()),
    target
  };

  const qs = generateApiQueryString(query);

  const { data, isLoading } = useSWR(
    [qs || "?", "properties"],
    ([q]) => fetcher(q),
    { keepPreviousData: true }
  );

  return { data, isLoading };
};

export default useProperties;
