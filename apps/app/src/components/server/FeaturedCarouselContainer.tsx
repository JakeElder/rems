import React from "react";
import { FeaturedCarousel } from "@rems/ui";
import fetch from "@/fetch";

type Props = {};

const FeaturedCarouselContainer = async ({}: Props) => {
  const properties = await fetch("featured-properties");
  return <FeaturedCarousel properties={properties} />;
};

export default FeaturedCarouselContainer;
