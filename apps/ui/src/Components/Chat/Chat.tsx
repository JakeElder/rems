"use client";

import React, { useMemo } from "react";
import css from "./Chat.module.css";
import { Timeline } from "@rems/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/avatar.png";
import ror from "../../assets/ror.png";
import { animated, useSpring, useTransition } from "@react-spring/web";
import ChatMessage from "../ChatMessage";

type Props = {
  audio?: { message?: HTMLAudioElement };
  timeline: Timeline;
  lang: "en" | "th";
  state: "SLEEPING" | "THINKING";
  open: boolean;
};

const Header = ({ state, lang }: Pick<Props, "state" | "lang">) => {
  return (
    <div className={css["header"]}>
      <div className={css["avatar-name-state"]}>
        <div className={css["avatar"]}>
          <img className={css["remi"]} src={avatar.src} />
          <div className={css["ror"]}>
            <img src={ror.src} width={ror.width / 2} height={ror.height / 2} />
          </div>
          <div className={css["shadow"]} />
        </div>
        <div className={css["name"]}>Remi</div>
        <div className={css["state"]}>{state}</div>
      </div>
      <div className={css["lang-pin"]}>
        <div className={css["lang"]}>{lang}</div>
        <div className={css["pin"]}>
          <FontAwesomeIcon icon={faThumbtack} size="xs" />
        </div>
      </div>
    </div>
  );
};

const Body = ({ timeline, audio }: Pick<Props, "timeline" | "audio">) => {
  const refMap = useMemo(() => new WeakMap(), []);

  const transitions = useTransition(timeline.slice().reverse(), {
    keys: (item) => item.id,
    from: { opacity: 0, height: 0 },
    enter: (item) => async (next) => {
      if (
        item.type === "ASSISTANT" &&
        item.message.type === "REACTION" &&
        item.message.reaction.type === "PATCH"
      ) {
        audio?.message?.play();
      }
      const $el = refMap.get(item);
      if ($el) {
        await next({ opacity: 1, height: $el.offsetHeight });
      }
    },
    leave: [{ opacity: 0 }, { height: 0 }]
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
};

const BodyReveal = ({
  open,
  children
}: { children: React.ReactNode } & Pick<Props, "open">) => {
  const style = useSpring({ height: open ? 400 : 0 });
  return <animated.div style={style}>{children}</animated.div>;
};

const Chat = ({ timeline, state, lang, open, audio = {} }: Props) => {
  return (
    <div className={css["root"]}>
      <Header state={state} lang={lang} />
      <BodyReveal open={open}>
        <Body timeline={timeline} audio={audio} />
      </BodyReveal>
    </div>
  );
};

export default Chat;
