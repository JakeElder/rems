import React from "react";
import { FeaturedCarousel } from "@rems/ui";
import fetch from "@/fetch";
import api from "@/api";

type Props = {};

const FeaturedCarouselContainer = async ({}: Props) => {
  const featured = await api.get.featuredProperties();
  const properties = await Promise.all(
    featured.map(async (id) => {
      const [property, images] = await Promise.all([
        fetch("property", id),
        fetch("properties/[id]/images", id)
      ]);
      return { ...property, images };
    })
  );
  return <FeaturedCarousel properties={properties} />;
};

export default FeaturedCarouselContainer;
