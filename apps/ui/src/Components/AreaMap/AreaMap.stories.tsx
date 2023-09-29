// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import AreaMap from "./AreaMap";

const meta: Meta<typeof AreaMap> = {
  title: "Components/AreaMap",
  component: AreaMap
};

type Story = StoryObj<typeof AreaMap>;

export const Default: Story = {
  args: { property: properties[0] }
};

export default meta;
