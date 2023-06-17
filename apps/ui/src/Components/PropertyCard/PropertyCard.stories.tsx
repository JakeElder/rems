import type { Meta, StoryObj } from "@storybook/react";
import PropertyCard from "./PropertyCard";
import properties from "../../fixtures/properties";

const meta: Meta<typeof PropertyCard> = {
  title: "Components/PropertyCard",
  component: PropertyCard,
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    )
  ]
};

type Story = StoryObj<typeof PropertyCard>;

export const Default: Story = {
  args: { property: properties[0] }
};

export default meta;
