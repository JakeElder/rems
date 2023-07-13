import type { Meta, StoryObj } from "@storybook/react";
import RefererClearer from "./RefererClearer";

const meta: Meta<typeof RefererClearer> = {
  title: "Elements/RefererClearer",
  component: RefererClearer
};

type Story = StoryObj<typeof RefererClearer>;

export const Default: Story = {
  args: {}
};

export default meta;
