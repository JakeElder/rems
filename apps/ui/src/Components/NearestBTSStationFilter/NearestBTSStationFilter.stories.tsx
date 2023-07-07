import type { Meta, StoryObj } from "@storybook/react";
import NearestBTSStationFilter from "./NearestBTSStationFilter";

const meta: Meta<typeof NearestBTSStationFilter> = {
  title: "Components/NearestBTSStationFilter",
  component: NearestBTSStationFilter
};

type Story = StoryObj<typeof NearestBTSStationFilter>;

export const Default: Story = {
  args: {}
};

export default meta;
