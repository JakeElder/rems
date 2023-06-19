"use client";

import React, { useState } from "react";
import { Property } from "@rems/types";
import FeaturedCarousel from "../../Components/FeaturedCarousel";
import StandardHeroLayout from "../../Layouts/StandardHeroLayout";
import { Default as cardData } from "../../Components/EntryCardGrid/EntryCardGrid.stories";
import EntryCardGrid from "../../Components/EntryCardGrid";
import Container from "../../Elements/Container/Container";
import css from "./HomePage.module.css";
import MailingListModule from "../../Components/MailingListModule";
import PropertySlider from "../../Components/PropertySlider";
import MonogramHR from "../../Components/MonogramHR";
import Footer from "../../Components/Footer";

type Props = {
  heroProperties: Property[];
};

const HomePage = ({ heroProperties }: Props) => {
  return (
    <StandardHeroLayout hero={<FeaturedCarousel properties={heroProperties} />}>
      <Container>
        <div className={css["popular-searches"]}>
          <h2 className={css["heading"]}>Popular Searches</h2>
          <EntryCardGrid cards={cardData.args?.cards!} />
        </div>
        <div className={css["email-collector"]}>
          <MailingListModule />
        </div>
        <div className={css["latest-properties"]}>
          <h2 className={css["heading"]}>Latest Properties</h2>
          <PropertySlider properties={heroProperties} />
        </div>
        <div className={css["hr"]}>
          <MonogramHR />
        </div>
      </Container>
      <div className={css["footer"]}>
        <Footer />
      </div>
    </StandardHeroLayout>
  );
};

export default HomePage;
