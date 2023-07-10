import type { Meta, StoryObj } from "@storybook/react";
import * as Page from "./HomePage";
import properties from "../../fixtures/properties";
import Header from "../../Components/Header";
import FeaturedCarousel from "../../Components/FeaturedCarousel";
import EntryCardGrid from "src/Components/EntryCardGrid/EntryCardGrid";
import { Default as cardData } from "../../Components/EntryCardGrid/EntryCardGrid.stories";
import MailingListModule from "../../Components/MailingListModule";
import PropertySlider from "../../Components/PropertySlider";

const meta: Meta<typeof Page> = {
  title: "Pages/HomePage",
  parameters: { layout: "fullscreen" }
};

type Story = StoryObj<typeof Page>;

export const Default: Story = {
  render() {
    return (
      <Page.Root>
        <Page.Header>
          <Header mode="hero" />
        </Page.Header>
        <Page.Hero>
          <FeaturedCarousel properties={properties} />
        </Page.Hero>
        <Page.Content>
          <Page.PopularSearches>
            <EntryCardGrid cards={cardData.args?.cards!} />
          </Page.PopularSearches>
          <Page.EmailCollector>
            <MailingListModule />
          </Page.EmailCollector>
          <Page.LatestProperties>
            <PropertySlider properties={properties} />
          </Page.LatestProperties>
        </Page.Content>
        <Page.Footer />
      </Page.Root>
    );
  }
};

export default meta;
