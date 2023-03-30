import type { Meta, StoryObj } from "@storybook/react";
import MapPropertyMarker from "./MapPropertyMarker";
import map from "../../assets/map-ss.png";
import properties from "../../fixtures/properties.json";
import { Property } from "@rems/types";

const meta: Meta<typeof MapPropertyMarker> = {
  title: "Components/MapPropertyMarker",
  component: MapPropertyMarker,
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `url(${map.src})`,
          backgroundSize: "cover"
        }}
      >
        <Story />
      </div>
    )
  ]
};

type Story = StoryObj<typeof MapPropertyMarker>;

export const Default: Story = {
  args: { property: (properties as unknown as Property[])[0] }
};

export default meta;
