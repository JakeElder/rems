import React from "react";
import { Property } from "@rems/types";
import FeaturedCarousel from "../../Components/FeaturedCarousel/FeaturedCarousel";
import StandardHeroLayout from "../../Layouts/StandardHeroLayout";
import { Default as cardData } from "../../Components/EntryCardGrid/EntryCardGrid.stories";
import EntryCardGrid from "../../Components/EntryCardGrid/EntryCardGrid";
import Container from "../../Elements/Container/Container";
import css from "./HomePage.module.css";

type Props = {
  heroProperties: Property[];
};

const HomePage = ({ heroProperties }: Props) => {
  return (
    <StandardHeroLayout hero={<FeaturedCarousel properties={heroProperties} />}>
      <Container>
        <div className={css["popular-searches"]}>
          <EntryCardGrid cards={cardData.args?.cards!} />
        </div>
      </Container>
    </StandardHeroLayout>
  );
};

export default HomePage;
