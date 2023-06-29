import type { Meta, StoryObj } from "@storybook/react";
import Truncate from "./Truncate";
import properties from "../../fixtures/properties";

const meta: Meta<typeof Truncate> = {
  title: "Components/Truncate",
  component: Truncate
};

type Story = StoryObj<typeof Truncate>;

export const Default: Story = {
  args: { copy: properties[1].description }
};

export default meta;
