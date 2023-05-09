import type { Meta, StoryObj } from "@storybook/react";
import { Property } from "@rems/types";
import PropertySlider from "./PropertySlider";
import properties from "../../fixtures/properties.json";

const meta: Meta<typeof PropertySlider> = {
  title: "Components/PropertySlider",
  component: PropertySlider
};

type Story = StoryObj<typeof PropertySlider>;

export const Default: Story = {
  args: {
    properties: properties as unknown as Property[]
  }
};

export default meta;
