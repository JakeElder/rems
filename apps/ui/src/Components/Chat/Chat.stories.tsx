import type { Meta, StoryObj } from "@storybook/react";
import * as Chat from "./Chat";
import React, { useEffect, useRef, useState } from "react";
import randomInt from "random-int";
import { Timeline } from "@rems/types";
import mockTimeline from "../../fixtures/timeline";

type Story = StoryObj<Chat.Props>;

const next = (source: Timeline, current: Timeline): [Timeline, boolean] => {
  const e = source.shift();
  return [[...current, e!], source.length === 0];
};

export const Mock = (props: Chat.Props) => {
  const source = useRef([...mockTimeline]);
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
      source.current = [...mockTimeline];
      setCurrent([]);
    };
  }, []);

  return (
    <Chat.Root>
      <Chat.Header {...props} />
      <Chat.Body {...props} timeline={t} />
    </Chat.Root>
  );
};

const meta: Meta<Chat.Props> = {
  title: "Chat/Chat",
  component: Mock
};

export const Default: Story = {
  args: {
    lang: "en",
    open: true,
    state: "SLEEPING",
    timeline: []
  }
};

export default meta;
