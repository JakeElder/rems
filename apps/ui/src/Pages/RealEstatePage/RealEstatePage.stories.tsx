import type { Meta, StoryObj } from "@storybook/react";
import RealEstatePage from "./RealEstatePage";

const meta: Meta<typeof RealEstatePage> = {
  title: "Pages/RealEstatePage",
  component: RealEstatePage,
  parameters: {
    layout: "fullscreen"
  }
};

type Story = StoryObj<typeof RealEstatePage>;

export const Default: Story = {
  args: {}
};

export default meta;
