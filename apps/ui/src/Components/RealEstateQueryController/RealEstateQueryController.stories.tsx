import type { Meta, StoryObj } from "@storybook/react";
import RealEstateQueryController from "./RealEstateQueryController";

const meta: Meta<typeof RealEstateQueryController> = {
  title: "Components/RealEstateQueryController",
  component: RealEstateQueryController
};

type Story = StoryObj<typeof RealEstateQueryController>;

export const Default: Story = {
  args: {}
};

export default meta;
