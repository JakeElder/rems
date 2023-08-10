import {
  FilterSet,
  PartialServerRealEstateQuery,
  ResolvingFilterSet
} from "@rems/types";
import { ServerRealEstateQuerySchema } from "@rems/schemas";
import useProperties from "@/hooks/use-properties";
import { generateQueryString } from "./use-real-estate-query";

const resolve: (slug: string) => PartialServerRealEstateQuery = (slug) => {
  const sets: Record<string, PartialServerRealEstateQuery> = {
    "cozy-pads-for-young-professionals": {
      "indoor-features": ["cozy"],
      availability: "rent"
    },
    "family-friendly-houses-with-gardens": {
      "outdoor-features": ["garden"],
      "lot-features": ["family-friendly"]
    },
    "new-builds-ready-to-move-in-to-in-bangkok": {
      "lot-features": ["new-built"]
    },
    "pool-villas-for-sale-in-bangkok": {
      "property-type": ["villa"],
      "outdoor-features": ["pool"]
    }
  };

  return sets[slug];
};

const useFilterSet = (set: FilterSet): ResolvingFilterSet => {
  const query = resolve(set.slug);

  const { data, isLoading } = useProperties(
    ServerRealEstateQuerySchema.parse(query)
  );

  const qs = generateQueryString(query);

  return {
    set,
    data,
    isLoading,
    url: `/real-estate${qs}`,
    query
  };
};

export default useFilterSet;
