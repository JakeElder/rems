// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import SimpleImageCarousel from "./SimpleImageCarousel";

const meta: Meta<typeof SimpleImageCarousel> = {
  title: "Components/SimpleImageCarousel",
  component: SimpleImageCarousel,
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

type Story = StoryObj<typeof SimpleImageCarousel>;

export const Default: Story = {
  args: { images: images[1] }
};

export default meta;
