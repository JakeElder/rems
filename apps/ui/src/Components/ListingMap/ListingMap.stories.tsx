import type { Meta, StoryObj } from "@storybook/react";
import ListingMap from "./ListingMap";
import properties from "../../fixtures/properties";

const meta: Meta<typeof ListingMap> = {
  title: "Components/ListingMap",
  component: ListingMap,
  parameters: {}
};

type Story = StoryObj<typeof ListingMap>;

export const Default: Story = {
  args: { properties }
};

export default meta;
