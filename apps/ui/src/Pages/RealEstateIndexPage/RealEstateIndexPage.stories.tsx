import type { Meta, StoryObj } from "@storybook/react";
import { Property } from "@rems/types";
import RealEstateIndexPage from "./RealEstateIndexPage";
import properties from "../../fixtures/properties.json";

const meta: Meta<typeof RealEstateIndexPage> = {
  title: "Pages/RealEstateIndexPage",
  component: RealEstateIndexPage,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof RealEstateIndexPage>;

export const Default: Story = {
  args: {
    properties: properties as unknown as Property[]
  }
};

export default meta;
