import type { Meta, StoryObj } from "@storybook/react";
import FilterPopover from "./FilterPopover";

const meta: Meta<typeof FilterPopover> = {
  title: "Components/FilterPopover",
  component: FilterPopover,
  parameters: {
    layout: "centered"
  }
};

type Story = StoryObj<typeof FilterPopover>;

export const Default: Story = {
  args: {
    label: "Type",
    children: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        Content
      </div>
    )
  }
};

export default meta;
