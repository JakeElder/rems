import type { Meta, StoryObj } from "@storybook/react";
import PlacesAutocomplete from "./PlacesAutocomplete";

const meta: Meta<typeof PlacesAutocomplete> = {
  title: "Components/PlacesAutocomplete",
  component: PlacesAutocomplete
};

type Story = StoryObj<typeof PlacesAutocomplete>;

export const Default: Story = {
  args: {}
};

export default meta;
