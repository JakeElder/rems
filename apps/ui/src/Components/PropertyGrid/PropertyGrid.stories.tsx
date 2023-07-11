import type { Meta, StoryObj } from "@storybook/react";
import PropertyGrid from "./PropertyGrid";

const meta: Meta<typeof PropertyGrid> = {
  title: "Components/PropertyGrid",
  component: PropertyGrid
};

type Story = StoryObj<typeof PropertyGrid>;

export const Default: Story = {
  args: {}
};

export default meta;
