import { createContext, useContext, useEffect } from "react";
import { Observable } from "@legendapp/state";
import { useObservable } from "@legendapp/state/react";
import { MapBounds, RealEstateQuery, SearchParams } from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import { flatten } from "remeda";
import { z } from "zod";
import { useRouter } from "next/router";

const IndexPageStateProvider = createContext<{
  query: Observable<RealEstateQuery>;
  stagedQuery: Observable<RealEstateQuery>;
  mapBounds: Observable<MapBounds | null>;
} | null>(null);

const useRealEstateIndexPageState = () => useContext(IndexPageStateProvider)!;

type ArrayKey = keyof z.infer<typeof RealEstateQuerySchema.Arrays>;

const searchParamsToQuery = (params: SearchParams): RealEstateQuery => {
  const arrayKeys: ArrayKey[] = [
    "indoor-features",
    "lot-features",
    "outdoor-features",
    "property-types",
    "view-types"
  ];

  const p = Object.keys(params).reduce((acc, key) => {
    const k = key.replace(/\[\]$/, "") as ArrayKey;
    const val = arrayKeys.includes(k)
      ? flatten([...[params[key]]])
      : params[key];
    return { ...acc, [k]: val };
  }, {});

  return RealEstateQuerySchema.URL.parse(p);
};

export const RealEstateIndexPageStateProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const query = searchParamsToQuery(router.query);

  const $ = {
    query: useObservable<RealEstateQuery>(query),
    stagedQuery: useObservable<RealEstateQuery>(query),
    mapBounds: useObservable<MapBounds | null>(null)
  };

  useEffect(() => {
    const nextQuery = searchParamsToQuery(router.query);
    $.query.set(nextQuery);
    $.stagedQuery.set(nextQuery);
  }, [router.query]);

  return (
    <IndexPageStateProvider.Provider
      value={{
        mapBounds: $.mapBounds,
        stagedQuery: $.stagedQuery,
        query: $.query
      }}
      children={children}
    />
  );
};

export default useRealEstateIndexPageState;
