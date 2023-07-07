import type { Meta, StoryObj } from "@storybook/react";
import NearestMRTStationFilter from "./NearestMRTStationFilter";

const meta: Meta<typeof NearestMRTStationFilter> = {
  title: "Components/NearestMRTStationFilter",
  component: NearestMRTStationFilter
};

type Story = StoryObj<typeof NearestMRTStationFilter>;

export const Default: Story = {
  args: {}
};

export default meta;
