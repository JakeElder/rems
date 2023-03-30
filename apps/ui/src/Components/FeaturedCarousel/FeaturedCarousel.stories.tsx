import type { Meta, StoryObj } from "@storybook/react";
import FeaturedCarousel from "./FeaturedCarousel";
import properties from "../../fixtures/properties.json";
import { Property } from "@rems/types";

const meta: Meta<typeof FeaturedCarousel> = {
  title: "Components/FeaturedHero",
  component: FeaturedCarousel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof FeaturedCarousel>;

export const Default: Story = {
  args: {
    properties: properties as unknown as Property[]
  }
};

export default meta;
