"use client";

import React, { useMemo, MutableRefObject, useEffect, useState } from "react";
import css from "./Chat.module.css";
import {
  AssistantMode,
  AssistantState,
  Timeline,
  TimelineEvent
} from "@rems/types";
import avatar from "../../assets/avatar.png";
import ror from "../../assets/ror.png";
import { Pick, animated, useSpring, useTransition } from "@react-spring/web";
import ChatMessage from "../ChatMessage";
import equal from "fast-deep-equal";
import { CHAT_PALETTE } from "../../colors";
import StateLabel from "../StateLabel/StateLabel";
import useAssistantUiLayout from "../../hooks/use-assistant-ui-layout";

export type Spacing = {
  xDivide: number;
  marginTop: number;
};

export type SpacingUtilityReturn =
  | { ready: false }
  | { ready: true; props: Spacing };

export type Props = {
  children: React.ReactNode;
  lang: "EN" | "TH";
  mode: AssistantMode;
  timeline: Timeline;
  placement: AssistantState["placement"];
} & Spacing;

export const Header = React.memo(
  ({ mode, lang }: Pick<Props, "mode" | "lang">) => {
    const palette = CHAT_PALETTE[mode];

    const { avatarBorder } = useSpring(palette);
    const { avatarOpacity } = useSpring({
      avatarOpacity: mode === "SLEEPING" ? 0.7 : 0.8
    });

    const pulseStyle = useSpring({
      from: { transform: "scale(1)", opacity: 1 },
      to: { transform: "scale(1.2)", opacity: 0 },
      reset: true,
      loop: true,
      config: { tension: 170, friction: 50 }
    });

    const { pulseOpacity } = useSpring({
      pulseOpacity: mode === "LISTENING" ? 1 : 0
    });

    const langStyle = useSpring({
      y: lang === "EN" ? 0 : -14,
      enOpacity: lang === "EN" ? 1 : 0,
      thOpacity: lang === "TH" ? 1 : 0
    });

    return (
      <div className={css["header"]}>
        <div className={css["avatar-name-state"]}>
          <animated.div
            className={css["avatar"]}
            style={{ borderColor: avatarBorder }}
          >
            <animated.span style={{ opacity: pulseOpacity }}>
              <animated.div
                className={css["avatar-ring"]}
                style={{ ...pulseStyle, borderColor: palette.avatarBorder }}
              />
            </animated.span>
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
          <StateLabel mode={mode} />
        </div>
        <div className={css["lang-manage-ui-state"]}>
          <div className={css["lang"]}>
            <animated.span
              className={css["en"]}
              style={{ y: langStyle.y, opacity: langStyle.enOpacity }}
            >
              EN
            </animated.span>
            <animated.span
              className={css["th"]}
              style={{ y: langStyle.y, opacity: langStyle.thOpacity }}
            >
              TH
            </animated.span>
          </div>
        </div>
      </div>
    );
  }
);

const isLanguageBasedEvent = (e: TimelineEvent) => e.event.type === "YIELD";

const isPatchEvent = (e: TimelineEvent) => e.event.type === "STATE_MUTATION";

const isEmptyPatchEvent = ({ role, event: e }: TimelineEvent) => {
  if (role === "ASSISTANT" && e.type === "STATE_MUTATION") {
    if (
      e.mutation.patch.type === "SCALAR" &&
      Object.keys(e.mutation.patch.data).length === 0
    ) {
      return true;
    }
    if (
      e.mutation.patch.type === "ARRAY" &&
      e.mutation.patch.diff.length === 0 &&
      e.mutation.patch.value.length === 0
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

    const events = timeline
      .slice()
      .reverse()
      .filter((e) => {
        if (isEmptyPatchEvent(e)) {
          return false;
        }

        if (isLanguageBasedEvent(e) || isPatchEvent(e)) {
          return true;
        }

        return false;
      });

    const transitions = useTransition(events, {
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

export const useAssistantSpacingUtility = ({
  $top,
  $left
}: {
  $top: MutableRefObject<HTMLDivElement | null>;
  $left: MutableRefObject<HTMLDivElement | null>;
}): SpacingUtilityReturn => {
  const [spacing, setSpacing] = useState<Spacing | null>(null);

  useEffect(() => {
    if ($left.current && $top.current) {
      const { width } = $left.current.getBoundingClientRect();
      const { height } = $top.current.getBoundingClientRect();
      setSpacing({ xDivide: width, marginTop: height });
    }
  }, [$left]);

  return spacing === null ? { ready: false } : { ready: true, props: spacing };
};

export const Root = ({
  children,
  placement,
  mode,
  xDivide,
  marginTop
}: Pick<
  Props,
  "children" | "placement" | "mode" | "xDivide" | "marginTop"
>) => {
  const {
    padding,
    borderRadius,
    boxShadow,
    backdropFilter,
    background,
    left,
    top,
    right,
    bottom
  } = useAssistantUiLayout({
    placement,
    mode,
    xDivide,
    marginTop
  });

  return (
    <animated.div className={css["root"]} style={{ left, top, right, bottom }}>
      <animated.div
        className={css["background"]}
        style={{
          borderRadius,
          boxShadow,
          backdropFilter,
          background
        }}
      />
      <animated.div className={css["foreground"]} style={{ padding }}>
        {children}
      </animated.div>
    </animated.div>
  );
};
