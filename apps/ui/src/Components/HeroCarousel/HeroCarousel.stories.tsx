import type { Meta, StoryObj } from "@storybook/react";
import HeroCarousel from "./HeroCarousel";

const meta: Meta<typeof HeroCarousel> = {
  title: "Components/HeroCarousel",
  component: HeroCarousel
};

type Story = StoryObj<typeof HeroCarousel>;

export const Default: Story = {
  args: {}
};

export default meta;
