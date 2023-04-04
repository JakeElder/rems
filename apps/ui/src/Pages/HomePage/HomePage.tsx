import React from "react";
import { Property } from "@rems/types";
import FeaturedCarousel from "../../Components/FeaturedCarousel/FeaturedCarousel";
import StandardHeroLayout from "../../Layouts/StandardHeroLayout";
import css from "./HomePage.module.css";
import { Default as cardData } from "../../Components/EntryCardGrid/EntryCardGrid.stories";
import EntryCardGrid from "../../Components/EntryCardGrid/EntryCardGrid";

type Props = {
  heroProperties: Property[];
};

const HomePage = ({ heroProperties }: Props) => {
  return (
    <StandardHeroLayout hero={<FeaturedCarousel properties={heroProperties} />}>
      <div className={css["popular-searches"]}>
        <EntryCardGrid cards={cardData.args?.cards!} />
      </div>
    </StandardHeroLayout>
  );
};

export default HomePage;
