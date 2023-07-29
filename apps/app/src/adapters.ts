import {
  Filter,
  FilterSet,
  Image,
  RealEstateQuery,
  SearchParams
} from "@rems/types";
import { RealEstateQuerySchema } from "@rems/schemas";
import { flatten } from "remeda";

const adapters = {
  searchParamsToPartialQuery(params: SearchParams): RealEstateQuery {
    const arrayKeys = [
      "indoor-features",
      "lot-features",
      "outdoor-features",
      "property-type",
      "view-types"
    ];

    const p = Object.keys(params).reduce((acc, key) => {
      const k = key.replace(/\[\]$/, "");
      const val = arrayKeys.includes(k)
        ? flatten([...[params[key]]])
        : params[key];
      return { ...acc, [k]: val };
    }, {});

    return RealEstateQuerySchema.parse(p);
  },

  filterSet(res: any): FilterSet {
    const { name, slug, image } = res.attributes;

    return {
      id: res.id,
      name,
      slug,
      image: adapters.image(image.data)
    };
  },

  image(res: any): Image {
    return {
      id: res.id,
      ...res.attributes,
      url: `${process.env.ASSET_URL}${res.attributes.url}`
    };
  },

  filter(res: any): Filter {
    const { name, createdAt, updatedAt, slug } = res.attributes;
    return { id: res.id, name, slug, createdAt, updatedAt };
  }
};

export default adapters;
