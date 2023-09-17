import type { Meta, StoryObj } from "@storybook/react";
import Chat from "./Chat";
import timeline from "../../fixtures/timeline";
import { useEffect, useRef, useState } from "react";
import { Timeline } from "@rems/types";
import randomInt from "random-int";
import click from "../../assets/sounds/click.mp3";

type Props = React.ComponentProps<typeof Chat>;

const next = (source: Timeline, current: Timeline): [Timeline, boolean] => {
  const e = source.shift();
  return [[...current, e!], source.length === 0];
};

const MockChat = (props: Props) => {
  const source = useRef([...timeline]);
  const to = useRef<NodeJS.Timeout>();
  const [t, setCurrent] = useState(props.timeline);

  const push = (current: Timeline) => {
    const [nextTimeline, complete] = next(source.current, current);
    setCurrent(nextTimeline);
    if (!complete) {
      to.current = setTimeout(() => push(nextTimeline), randomInt(500, 2200));
    }
  };

  useEffect(() => {
    to.current = setTimeout(() => push(t), randomInt(500, 2200));
    () => {
      clearTimeout(to.current);
      source.current = [...timeline];
      setCurrent([]);
    };
  }, []);

  return <Chat {...props} timeline={t} />;
};

const meta: Meta<Props> = {
  title: "Chat/Chat",
  component: Chat,
  render: ({ ...args }) => {
    return <MockChat {...args} />;
  }
};

type Story = StoryObj<Props>;

const message = new Audio(click);
message.volume = 0.1;

var audio = { message };

export const Default: Story = {
  args: {
    audio,
    lang: "en",
    open: true,
    state: "SLEEPING",
    timeline: []
  }
};

export default meta;
