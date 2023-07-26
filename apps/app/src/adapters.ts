import {
  Filter,
  FilterSet,
  Image,
  Property,
  RealEstateQuery,
  SearchParams,
  realEstateQuerySchema
} from "@rems/types";
import slugify from "slugify";
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

    return realEstateQuerySchema.parse(p);
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
      src: `${process.env.ASSET_URL}${res.url}`,
      ...res
    };
  },

  property(res: any): Property {
    const {
      title,
      uid,
      purchasePrice,
      rentalPrice,
      images,
      location,
      bedrooms,
      bathrooms,
      livingArea,
      description,
      createdAt,
      updatedAt,
      indoor_features,
      lot_features,
      outdoor_features,
      view_types,
      address,
      publishedAt
    } = res;

    return {
      id: res.id,
      uid,
      title,
      description,
      purchasePrice,
      rentalPrice,
      url: `/real-estate/${slugify(title, { strict: true })}-${res.id}`,
      location,
      formattedPurchasePrice: purchasePrice
        ? `฿${purchasePrice.toLocaleString()}`
        : null,
      formattedRentalPrice: rentalPrice
        ? `฿${rentalPrice.toLocaleString()}`
        : null,
      bedrooms,
      bathrooms,
      indoorFeatures: (indoor_features?.data || []).map(adapters.filter),
      lotFeatures: (lot_features?.data || []).map(adapters.filter),
      outdoorFeatures: (outdoor_features?.data || []).map(adapters.filter),
      viewTypes: (view_types?.data || []).map(adapters.filter),
      address,
      livingArea,
      images: (images || []).map(adapters.image),
      createdAt,
      updatedAt,
      publishedAt
    };
  },

  filter(res: any): Filter {
    const { name, createdAt, updatedAt, slug } = res.attributes;
    return { id: res.id, name, slug, createdAt, updatedAt };
  }
};

export default adapters;
