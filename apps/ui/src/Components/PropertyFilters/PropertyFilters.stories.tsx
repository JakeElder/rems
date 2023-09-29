// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import PropertyFilters from "./PropertyFilters";

const meta: Meta<typeof PropertyFilters> = {
  title: "Components/PropertyFilters",
  component: PropertyFilters,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 300 }}>
        <Story />
      </div>
    )
  ]
};

type Story = StoryObj<typeof PropertyFilters>;

export const Default: Story = {
  args: {}
};

export default meta;
