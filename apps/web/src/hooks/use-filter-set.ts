import { FilterSet, RealEstateQuery, ResolvingFilterSet } from "@rems/types";
import useProperties from "@/hooks/use-properties";
import { generateQueryString } from "./use-real-estate-query";
import { RealEstateQuerySchema } from "@rems/schemas";

const resolve: (slug: string) => Partial<RealEstateQuery> = (slug) => {
  const sets: Record<string, Partial<RealEstateQuery>> = {
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
      "property-types": ["villa"],
      "outdoor-features": ["pool"]
    }
  };

  return sets[slug];
};

const useFilterSet = (set: FilterSet): ResolvingFilterSet => {
  const query = resolve(set.slug);

  const { data, isLoading } = useProperties(
    RealEstateQuerySchema.Server.parse(query)
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
