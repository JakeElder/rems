import type { Meta, StoryObj } from "@storybook/react";
import PropertyCard from "./PropertyCard";

const meta: Meta<typeof PropertyCard> = {
  title: "Components/PropertyCard",
  component: PropertyCard
};

type Story = StoryObj<typeof PropertyCard>;

export const Default: Story = {
  args: {}
};

export default meta;
