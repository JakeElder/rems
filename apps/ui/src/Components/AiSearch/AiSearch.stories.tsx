import type { Meta, StoryObj } from "@storybook/react";
import AiSearch from "./AiSearch";

const meta: Meta<typeof AiSearch> = {
  title: "Components/AiSearch",
  component: AiSearch
};

type Story = StoryObj<typeof AiSearch>;

export const Default: Story = {
  args: {}
};

export default meta;
