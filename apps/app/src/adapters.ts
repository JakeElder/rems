import { Filter, FilterSet, Image, Property } from "@rems/types";

const adapters = {
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
      src: `${process.env.ASSET_URL}${res.attributes.url}`,
      ...res.attributes
    };
  },

  property(res: any): Property {
    const {
      title,
      purchasePrice,
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
    } = res.attributes;

    return {
      id: res.id,
      title,
      description,
      purchasePrice,
      location: JSON.parse(location),
      formattedPurchasePrice: `฿${purchasePrice.toLocaleString()}`,
      bedrooms,
      bathrooms,
      indoorFeatures: (indoor_features?.data || []).map(adapters.filter),
      lotFeatures: (lot_features?.data || []).map(adapters.filter),
      outdoorFeatures: (outdoor_features?.data || []).map(adapters.filter),
      viewTypes: (view_types?.data || []).map(adapters.filter),
      address,
      livingArea,
      images: (images.data || []).map(adapters.image),
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
