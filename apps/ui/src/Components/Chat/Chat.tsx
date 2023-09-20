"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import css from "./Chat.module.css";
import { AssistantState, Timeline, TimelineEvent } from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/avatar.png";
import ror from "../../assets/ror.png";
import { Pick, animated, useSpring, useTransition } from "@react-spring/web";
import ChatMessage from "../ChatMessage";
import equal from "fast-deep-equal";

export type Props = {
  onOpenClose: (open: boolean) => void;
  timeline: Timeline;
  lang: "en" | "th";
  state: AssistantState;
  open: boolean;
};

const OpenClose = ({
  open,
  onOpenClose
}: Pick<Props, "open" | "onOpenClose">) => {
  const { rotate } = useSpring({ rotate: open ? 0 : 180 });

  return (
    <animated.button
      className={css["open-close-button"]}
      onClick={() => onOpenClose(!open)}
      style={{
        transform: rotate.to((value) => `rotate(${value}deg)`)
      }}
    >
      <FontAwesomeIcon className={css["close"]} icon={faCaretDown} size="xs" />
    </animated.button>
  );
};

type State = { label: string };
const states: Record<Props["state"], State> = {
  CHATTING: { label: "Chatting" },
  SLEEPING: { label: "Sleeping" },
  THINKING: { label: "Thinking" },
  LISTENING: { label: "Listening" },
  CLEARING_QUERY: { label: "Clearing Query" },
  REFINING_QUERY: { label: "Refining Query" }
};

type GroupedState = "IDLE" | "LISTENING" | "THINKING" | "INTERACTING";
type Color = {
  avatarBorder: string;
  labelBg: string;
  labelColor: string;
};

const stateToGroup = (state: Props["state"]): GroupedState => {
  const map: Record<Props["state"], GroupedState> = {
    CHATTING: "INTERACTING",
    SLEEPING: "IDLE",
    THINKING: "THINKING",
    LISTENING: "LISTENING",
    CLEARING_QUERY: "INTERACTING",
    REFINING_QUERY: "INTERACTING"
  };
  return map[state];
};

const colors: Record<GroupedState, Color> = {
  IDLE: {
    avatarBorder: "#d1d1d1",
    labelBg: "#F2F2F2",
    labelColor: "#333333"
  },
  LISTENING: {
    avatarBorder: "#8850a2",
    labelBg: "#8850a2",
    labelColor: "#fff"
  },
  THINKING: {
    avatarBorder: "#ecbb56",
    labelBg: "#ecbb56",
    labelColor: "#fff"
  },
  INTERACTING: {
    avatarBorder: "#439a5f",
    labelBg: "#439a5f",
    labelColor: "#fff"
  }
};

const State = ({ state }: Pick<Props, "state">) => {
  const { labelBg, labelColor } = useSpring(colors[stateToGroup(state)]);
  const keys = Object.keys(states) as Props["state"][];
  const firstRender = useRef(true);

  const labelStyles = useSpring<Record<Props["state"], number>>(
    keys.reduce((p, c) => {
      return { ...p, [c]: state === c ? 1 : 0 };
    }, {})
  );

  const refs = useRef<Partial<Record<Props["state"], HTMLSpanElement | null>>>(
    {}
  );

  const [{ width }, api] = useSpring(() => ({ width: 0 }));

  useLayoutEffect(() => {
    firstRender.current = false;
    const el = refs.current[state];
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    api.start({ width: rect.width });
  }, [state]);

  return (
    <animated.div
      className={css["label"]}
      style={{
        backgroundColor: labelBg,
        color: labelColor,
        width: firstRender.current ? "auto" : width
      }}
    >
      {keys.map((s) => (
        <animated.div
          className={css["state"]}
          style={{ opacity: labelStyles[s] }}
          key={s}
        >
          <span ref={(e) => (refs.current[s] = e)}>{states[s].label}</span>
        </animated.div>
      ))}
      {states[state].label}
    </animated.div>
  );
};

export const Header = ({
  state,
  lang,
  open,
  onOpenClose
}: Pick<Props, "state" | "lang" | "open" | "onOpenClose">) => {
  const { avatarBorder } = useSpring(colors[stateToGroup(state)]);
  return (
    <div className={css["header"]}>
      <div className={css["avatar-name-state"]}>
        <animated.div
          className={css["avatar"]}
          style={{ borderColor: avatarBorder }}
        >
          <div className={css["avatar-inner"]}>
            <img className={css["remi"]} src={avatar.src} />
            <div className={css["ror"]}>
              <img
                src={ror.src}
                width={ror.width / 2}
                height={ror.height / 2}
              />
            </div>
            <div className={css["shadow"]} />
          </div>
        </animated.div>
        <div className={css["name"]}>Remi</div>
        <State state={state} />
      </div>
      <div className={css["lang-open-close"]}>
        <div className={css["lang"]}>{lang}</div>
        <div className={css["open-close"]}>
          <OpenClose open={open} onOpenClose={onOpenClose} />
        </div>
      </div>
    </div>
  );
};

const isLanguageBasedUserMessageEvent = (e: TimelineEvent) =>
  e.type === "USER" &&
  (e.interaction.type === "VERBAL" || e.interaction.type === "WRITTEN");

const isPatchEvent = (e: TimelineEvent) =>
  e.type === "ASSISTANT" &&
  e.message.type === "REACTION" &&
  e.message.reaction.type === "PATCH";

const isEmptyPatchEvent = (e: TimelineEvent) => {
  if (
    e.type === "ASSISTANT" &&
    e.message.type === "REACTION" &&
    e.message.reaction.type === "PATCH"
  ) {
    if (
      e.message.reaction.patch.type === "SCALAR" &&
      Object.keys(e.message.reaction.patch.data).length === 0
    ) {
      return true;
    }
    if (
      e.message.reaction.patch.type === "ARRAY" &&
      e.message.reaction.patch.diff.length === 0 &&
      e.message.reaction.patch.value.length === 0
    ) {
      return true;
    }
  }
  return false;
};

const BodyReveal = ({
  open,
  children
}: { children: React.ReactNode } & Pick<Props, "open">) => {
  const style = useSpring({ height: open ? 400 : 0 });
  return <animated.div style={style}>{children}</animated.div>;
};

export const Body = React.memo(
  ({ timeline, open }: Pick<Props, "timeline" | "open">) => {
    const refMap = useMemo(() => new WeakMap(), []);

    const messages = timeline
      .slice()
      .reverse()
      .filter((e) => {
        if (isEmptyPatchEvent(e)) {
          return false;
        }

        if (isLanguageBasedUserMessageEvent(e) || isPatchEvent(e)) {
          return true;
        }

        return false;
      });

    const transitions = useTransition(messages, {
      keys: (item) => item.id,
      from: { opacity: 0, height: 0 },
      enter: (item) => async (next) => {
        const $el = refMap.get(item);
        await next({ opacity: 1, height: $el.offsetHeight });
      }
    });

    return (
      <BodyReveal open={open}>
        <div className={css["body"]}>
          <div className={css["shadow"]} />
          <div className={css["timeline"]}>
            {transitions((style, e) => {
              return (
                <animated.div style={style} key={e.id}>
                  <ChatMessage
                    key={e.id}
                    {...e}
                    ref={(ref: HTMLDivElement) => ref && refMap.set(e, ref)}
                  />
                </animated.div>
              );
            })}
          </div>
        </div>
      </BodyReveal>
    );
  },
  (prev, next) => equal(prev.timeline, next.timeline)
);

export const Root = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["root"]}>{children}</div>;
};
