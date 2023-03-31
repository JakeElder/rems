import React from "react";
import { Property } from "@rems/types";
import FeaturedCarousel from "../../Components/FeaturedCarousel/FeaturedCarousel";
import StandardHeroLayout from "../../Layouts/StandardHeroLayout";
import css from "./HomePage.module.css";

type Props = {
  heroProperties: Property[];
};

const HomePage = ({ heroProperties }: Props) => {
  return (
    <StandardHeroLayout hero={<FeaturedCarousel properties={heroProperties} />}>
      <div className={css["content"]} />
    </StandardHeroLayout>
  );
};

export default HomePage;
