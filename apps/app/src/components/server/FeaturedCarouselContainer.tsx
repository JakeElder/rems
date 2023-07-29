import React from "react";
import api from "../../api";
import { FeaturedCarousel } from "@rems/ui";
import fetch from "@/fetch";

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
