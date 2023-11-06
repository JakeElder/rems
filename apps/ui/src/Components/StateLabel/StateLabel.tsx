import React, { useEffect, useRef } from "react";
import css from "./StateLabel.module.css";
import { AssistantState } from "@rems/types";
import { animated, useSpring } from "@react-spring/web";
import { CHAT_PALETTE } from "../../colors";

type Props = {
  mode: AssistantState["mode"];
};

const labels: Record<AssistantState["mode"], string> = {
  CHATTING: "Chatting",
  SLEEPING: "Sleeping",
  THINKING: "Thinking",
  LISTENING: "Listening",
  WORKING: "Working"
};

const StateLabel = React.memo(({ mode }: Props) => {
  const { labelBg, labelColor } = useSpring(CHAT_PALETTE[mode]);

  const keys = useRef<Props["mode"][]>([
    mode,
    ...(Object.keys(labels).filter((s) => s !== mode) as Props["mode"][])
  ]);
  const firstRender = useRef(true);

  const labelStyles = useSpring<Record<Props["mode"], number>>(
    keys.current.reduce((p, c) => {
      return { ...p, [c]: mode === c ? 1 : 0 };
    }, {})
  );

  type Elements = Partial<Record<Props["mode"], HTMLSpanElement | null>>;
  const refs = useRef<Elements>({});

  const [{ width, opacity }, api] = useSpring(() => ({ width: 0, opacity: 1 }));

  useEffect(() => {
    const el = refs.current[mode];

    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();

    if (firstRender.current) {
      api.set({ width: rect.width });
      firstRender.current = false;
      return;
    }

    api.start({ width: rect.width, opacity: 1 });
  }, [mode]);

  const palette = CHAT_PALETTE[mode];

  const pulseStyle = useSpring({
    from: { scaleX: 1, scaleY: 1, opacity: 1 },
    to: { scaleX: 1.1, scaleY: 1.4, opacity: 0 },
    reset: true,
    loop: true,
    config: { tension: 170, friction: 50 }
  });

  const { pulseOpacity } = useSpring({
    pulseOpacity: mode === "LISTENING" ? 1 : 0
  });

  return (
    <animated.div
      className={css["root"]}
      style={{
        backgroundColor: labelBg,
        color: labelColor,
        width
      }}
    >
      <animated.span style={{ opacity: pulseOpacity }}>
        <animated.span
          style={{ ...pulseStyle, borderColor: palette.labelBg }}
          className={css["pulse"]}
        />
      </animated.span>
      <animated.div style={{ opacity }}>
        {keys.current.map((s) => (
          <animated.div
            className={css["state"]}
            style={{ opacity: labelStyles[s] }}
            key={s}
          >
            <span ref={(e) => (refs.current[s] = e)}>{labels[s]}</span>
          </animated.div>
        ))}
      </animated.div>
    </animated.div>
  );
});

export default StateLabel;
