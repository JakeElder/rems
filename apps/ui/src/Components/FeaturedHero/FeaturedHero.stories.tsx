import type { Meta, StoryObj } from "@storybook/react";
import FeaturedHero from "./FeaturedHero";

import img1 from "../../assets/hero-pics/1.jpeg";
import img2 from "../../assets/hero-pics/2.jpeg";
import img3 from "../../assets/hero-pics/3.jpeg";
import img4 from "../../assets/hero-pics/4.jpeg";

const meta: Meta<typeof FeaturedHero> = {
  title: "Organisms/FeaturedHero",
  component: FeaturedHero,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof FeaturedHero>;

export const Default: Story = {
  args: { images: [img1, img2, img3, img4] }
};

export default meta;
