import type { Meta, StoryObj } from "@storybook/react";
import FeaturedHero from "./FeaturedHero";
import properties from "../../fixtures/properties.json";
import { Property } from "@rems/types";

const meta: Meta<typeof FeaturedHero> = {
  title: "Components/FeaturedHero",
  component: FeaturedHero,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  },
  argTypes: {
    theme: {
      options: ["dark", "light"]
    }
  }
};

type Story = StoryObj<typeof FeaturedHero>;

export const Default: Story = {
  args: {
    properties: properties as unknown as Property[],
    theme: "light"
  }
};

export default meta;
