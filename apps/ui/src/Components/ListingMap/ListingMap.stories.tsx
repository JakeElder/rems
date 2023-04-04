import type { Meta, StoryObj } from "@storybook/react";
import ListingMap from "./ListingMap";
import properties from "../../fixtures/properties.json";
import { Property } from "@rems/types";

const meta: Meta<typeof ListingMap> = {
  title: "Components/ListingMap",
  component: ListingMap,
  parameters: {}
};

type Story = StoryObj<typeof ListingMap>;

export const Default: Story = {
  args: {
    properties: properties as unknown as Property[]
  }
};

export default meta;
