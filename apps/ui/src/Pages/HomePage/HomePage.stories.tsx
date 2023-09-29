// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import * as Page from "./HomePage";
import FeaturedCarousel from "../../Components/FeaturedCarousel";
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
        <Page.Hero>
          <FeaturedCarousel properties={properties} />
        </Page.Hero>
        <Page.Content>
          <Page.LatestProperties>
            <PropertySlider properties={properties} />
          </Page.LatestProperties>
        </Page.Content>
      </Page.Root>
    );
  }
};

export default meta;
