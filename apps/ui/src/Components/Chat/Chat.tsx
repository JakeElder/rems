"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import css from "./Chat.module.css";
import {
  AssistantState,
  GroupedAssistantState,
  Timeline,
  TimelineEvent
} from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/avatar.png";
import ror from "../../assets/ror.png";
import { Pick, animated, useSpring, useTransition } from "@react-spring/web";
import ChatMessage from "../ChatMessage";
import equal from "fast-deep-equal";
import { CHAT_PALETTE } from "../../colors";

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

const stateToGroup = (state: Props["state"]): GroupedAssistantState => {
  const map: Record<Props["state"], GroupedAssistantState> = {
    CHATTING: "INTERACTING",
    SLEEPING: "IDLE",
    THINKING: "THINKING",
    LISTENING: "LISTENING",
    CLEARING_QUERY: "INTERACTING",
    REFINING_QUERY: "INTERACTING"
  };
  return map[state];
};

const State = ({ state }: Pick<Props, "state">) => {
  const { labelBg, labelColor } = useSpring(CHAT_PALETTE[stateToGroup(state)]);
  const keys = useRef<Props["state"][]>([
    state,
    ...(Object.keys(states).filter((s) => s !== state) as Props["state"][])
  ]);
  const firstRender = useRef(true);

  const labelStyles = useSpring<Record<Props["state"], number>>(
    keys.current.reduce((p, c) => {
      return { ...p, [c]: state === c ? 1 : 0 };
    }, {})
  );

  type Spans = Partial<Record<Props["state"], HTMLSpanElement | null>>;
  const refs = useRef<Spans>({});

  const [{ width, opacity }, api] = useSpring(() => ({ width: 0, opacity: 1 }));

  const updateVisibility = () => {
    keys.current.forEach((k) => {
      refs.current[k]!.style.visibility = state === k ? "initial" : "hidden";
    });
  };

  useLayoutEffect(() => {
    const el = refs.current[state];

    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();

    if (firstRender.current) {
      api.set({ width: rect.width });
      updateVisibility();
      firstRender.current = false;
      return;
    }

    const [shrink] = api.start({
      width: 0,
      opacity: 0
    });

    shrink.then(() => {
      updateVisibility();
      api.start({ width: rect.width, opacity: 1 });
    });
  }, [state]);

  return (
    <animated.div
      className={css["label"]}
      style={{
        backgroundColor: labelBg,
        color: labelColor,
        width
      }}
    >
      <animated.div style={{ opacity }}>
        {keys.current.map((s) => (
          <animated.div
            className={css["state"]}
            style={{ opacity: labelStyles[s] }}
            key={s}
          >
            <span ref={(e) => (refs.current[s] = e)}>{states[s].label}</span>
          </animated.div>
        ))}
      </animated.div>
    </animated.div>
  );
};

export const Header = ({
  state,
  lang,
  open,
  onOpenClose
}: Pick<Props, "state" | "lang" | "open" | "onOpenClose">) => {
  const { avatarBorder } = useSpring(CHAT_PALETTE[stateToGroup(state)]);
  const { avatarOpacity } = useSpring({
    avatarOpacity: state === "SLEEPING" ? 0.7 : 0.8
  });

  return (
    <div className={css["header"]}>
      <div className={css["avatar-name-state"]}>
        <animated.div
          className={css["avatar"]}
          style={{ borderColor: avatarBorder }}
        >
          <div className={css["avatar-inner"]}>
            <animated.img
              className={css["remi"]}
              src={avatar.src}
              style={{ opacity: avatarOpacity }}
            />
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

export const Dialog = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["dialog"]}>{children}</div>;
};

export const Input = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["input"]}>{children}</div>;
};

export const Body = React.memo(
  ({ timeline }: Pick<Props, "timeline">) => {
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
    );
  },
  (prev, next) => equal(prev.timeline, next.timeline)
);

const HEIGHT = 570;
const HEADER_HEIGHT = 60;
const FOREGROUND_PADDING_TOP = 20;

export const Root = ({
  children,
  open
}: { children: React.ReactNode } & Pick<Props, "open">) => {
  const rootStyle = useSpring({
    y: open ? 0 : HEIGHT - (HEADER_HEIGHT + FOREGROUND_PADDING_TOP)
  });

  const backgroundStyle = useSpring({
    background: open ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0)",
    boxShadow: open
      ? "0 0 5px 0 rgba(0, 0, 0, 0.4)"
      : "0 0 5px 0 rgba(0, 0, 0, 0)",
    backdropFilter: open ? "blur(4px)" : "blur(0px)"
  });

  return (
    <animated.div className={css["root"]} style={rootStyle}>
      <animated.div className={css["background"]} style={backgroundStyle} />
      <animated.div className={css["foreground"]}>{children}</animated.div>
    </animated.div>
  );
};
