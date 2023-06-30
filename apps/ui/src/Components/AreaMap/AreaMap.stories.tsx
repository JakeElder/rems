import type { Meta, StoryObj } from "@storybook/react";
import AreaMap from "./AreaMap";
import properties from "../../fixtures/properties";

const meta: Meta<typeof AreaMap> = {
  title: "Components/AreaMap",
  component: AreaMap
};

type Story = StoryObj<typeof AreaMap>;

export const Default: Story = {
  args: { property: properties[0] }
};

export default meta;
