import api from "../api";
import { FeaturedCarousel } from "@rems/ui";
import React from "react";

type Props = {};

const Hero = async ({}: Props) => {
  const featured = await api.get.featuredProperties();
  return <FeaturedCarousel properties={featured} />;
};

export default Hero;
