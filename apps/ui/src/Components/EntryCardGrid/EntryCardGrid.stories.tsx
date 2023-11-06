// @ts-nocheck

import type { Meta, StoryObj } from "@storybook/react";
import * as EntryCardGrid from "./EntryCardGrid";

import c1 from "../../assets/hero-pics/1.jpeg";
import c2 from "../../assets/hero-pics/2.jpeg";
import c3 from "../../assets/hero-pics/3.jpeg";
import c4 from "../../assets/hero-pics/4.jpeg";

const meta: Meta<typeof EntryCardGrid> = {
  title: "Components/EntryCardGrid",
  component: EntryCardGrid
};

type Story = StoryObj<typeof EntryCardGrid>;

export const Default: Story = {
  args: {
    cards: [
      {
        title: "Rental Properties in Bangkok",
        caption: "276 listings",
        url: "#",
        image: {
          id: "1",
          src: c1.src,
          width: c1.width,
          height: c1.height
        }
      },
      {
        title: "Beach Villa’s for Sale in Hua Hin",
        caption: "23 listings",
        url: "#",
        image: {
          id: "2",
          src: c2.src,
          width: c2.width,
          height: c2.height
        }
      },
      {
        title: "Beach Cabins in Phuket",
        caption: "112 listings",
        url: "#",
        image: {
          id: "3",
          src: c3.src,
          width: c3.width,
          height: c3.height
        }
      },
      {
        title: "Condos in Silom",
        caption: "44 listings",
        url: "#",
        image: {
          id: "4",
          src: c4.src,
          width: c4.width,
          height: c4.height
        }
      }
    ]
  }
};

export default meta;
