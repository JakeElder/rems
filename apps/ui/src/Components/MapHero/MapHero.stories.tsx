import type { Meta, StoryObj } from "@storybook/react";
import MapHero from "./MapHero";
import properties from "../../fixtures/properties.json";
import { Property } from "@rems/types";

const meta: Meta<typeof MapHero> = {
  title: "Components/MapHero",
  component: MapHero,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof MapHero>;

export const Default: Story = {
  args: {
    theme: "light",
    properties: properties as unknown as Property[]
  }
};

export default meta;
