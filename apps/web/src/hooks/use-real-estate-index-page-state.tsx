import { createContext, useContext, useEffect } from "react";
import { Observable } from "@legendapp/state";
import { useObservable } from "@legendapp/state/react";
import {
  MapBounds,
  RealEstateQuery,
  SearchParams,
  Timeline
} from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import { flatten } from "remeda";
import { z } from "zod";
import { useRouter } from "next/router";

const IndexPageStateProvider = createContext<{
  query: Observable<RealEstateQuery>;
  stagedQuery: Observable<RealEstateQuery>;
  mapBounds: Observable<MapBounds | null>;
  timeline: Observable<Timeline>;
  spaceDown: Observable<boolean>;
} | null>(null);

const useRealEstateIndexPageState = () => {
  const $ = useContext(IndexPageStateProvider);
  if ($ === null) {
    throw new Error();
  }
  return $;
};

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
    const val = arrayKeys.includes(k) ? flatten() : params[key];
    return { ...acc, [k]: val };
  }, {});

  return RealEstateQuerySchema.URL.parse(p);
};

const isHTMLElement = (el: any): el is HTMLElement => el instanceof HTMLElement;

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
    mapBounds: useObservable<MapBounds | null>(null),
    timeline: useObservable<Timeline>([]),
    spaceDown: useObservable<boolean>(false)
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        $.spaceDown.set(true);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (isHTMLElement(e.target) && e.target.nodeName === "INPUT") {
          return;
        }
        e.preventDefault();
        $.spaceDown.set(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const nextQuery = searchParamsToQuery(router.query);
    $.query.set(nextQuery);
    $.stagedQuery.set(nextQuery);
  }, [router.query]);

  return (
    <IndexPageStateProvider.Provider
      value={{
        query: $.query,
        stagedQuery: $.stagedQuery,
        mapBounds: $.mapBounds,
        timeline: $.timeline,
        spaceDown: $.spaceDown
      }}
      children={children}
    />
  );
};

export default useRealEstateIndexPageState;
