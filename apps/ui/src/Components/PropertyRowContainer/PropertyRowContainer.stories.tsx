import type { Meta, StoryObj } from "@storybook/react";
import PropertyRowContainer from "./PropertyRowContainer";

const meta: Meta<typeof PropertyRowContainer> = {
  title: "Components/PropertyRowContainer",
  component: PropertyRowContainer
};

type Story = StoryObj<typeof PropertyRowContainer>;

export const Default: Story = {
  args: {}
};

export default meta;
