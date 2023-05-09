import type { Meta, StoryObj } from "@storybook/react";
import MonogramHR from "./MonogramHR";

const meta: Meta<typeof MonogramHR> = {
  title: "Components/MonogramHR",
  component: MonogramHR
};

type Story = StoryObj<typeof MonogramHR>;

export const Default: Story = {
  args: {}
};

export default meta;
