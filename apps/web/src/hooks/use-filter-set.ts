import {
  FilterSet,
  GetPropertiesResult,
  RealEstateQuery,
  ResolvingFilterSet
} from "@rems/types";
import { generateApiQueryString } from "@rems/utils/query";
import * as app from "@rems/state/app";
import { DeepPartial } from "@reduxjs/toolkit";
import useSWR from "swr";
import extend from "deep-extend";

const resolve: (slug: string) => DeepPartial<RealEstateQuery> = (slug) => {
  const sets: Record<string, DeepPartial<RealEstateQuery>> = {
    "cozy-pads-for-young-professionals": {
      indoorFeatures: [{ id: 17, slug: "cozy" }],
      budgetAndAvailability: { type: "RENT" }
    },
    "family-friendly-houses-with-gardens": {
      outdoorFeatures: [{ id: 3, slug: "garden" }],
      lotFeatures: [{ id: 23, slug: "family-friendly" }]
    },
    "new-builds-ready-to-move-in-to-in-bangkok": {
      lotFeatures: [{ id: 4, slug: "new-built" }]
    },
    "pool-villas-for-sale-in-bangkok": {
      propertyTypes: [{ id: 2, slug: "villa" }],
      outdoorFeatures: [{ id: 1, slug: "pool" }]
    }
  };

  return sets[slug];
};

const fetcher = async (query: string): Promise<GetPropertiesResult> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_REMS_API_URL}/properties${query}`
  );
  const json = await res.json();
  return json;
};

const useFilterSet = (set: FilterSet): ResolvingFilterSet => {
  const query = extend(
    app.defaults().slices.realEstateQuery,
    resolve(set.slug)
  );

  const qs = generateApiQueryString({ ...query, target: "LISTINGS" });

  const { data, isLoading } = useSWR(
    [qs || "?", "properties"],
    ([q]) => fetcher(q),
    { keepPreviousData: true }
  );

  return {
    set,
    data,
    isLoading,
    url: `/real-estate${qs}`,
    query
  };
};

export default useFilterSet;
