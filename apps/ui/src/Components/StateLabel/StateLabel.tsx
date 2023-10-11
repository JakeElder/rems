import React, { useEffect, useRef } from "react";
import css from "./StateLabel.module.css";
import { AssistantState } from "@rems/types";
import { animated, useSpring } from "@react-spring/web";
import { CHAT_PALETTE } from "../../colors";
import { assistantStateToGroupedAssistantState } from "../../adapters";

type Props = { state: AssistantState };

type State = { label: string };
const states: Record<Props["state"], State> = {
  CHATTING: { label: "Chatting" },
  SLEEPING: { label: "Sleeping" },
  THINKING: { label: "Thinking" },
  LISTENING: { label: "Listening" },
  CLEARING_QUERY: { label: "Clearing Query" },
  REFINING_QUERY: { label: "Refining Query" },
  OPENING: { label: "Opening" }
};

const StateLabel = ({ state }: Props) => {
  const group = assistantStateToGroupedAssistantState(state);
  const { labelBg, labelColor } = useSpring(CHAT_PALETTE[group]);
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

  type Elements = Partial<Record<Props["state"], HTMLSpanElement | null>>;
  const refs = useRef<Elements>({});

  const [{ width, opacity }, api] = useSpring(() => ({ width: 0, opacity: 1 }));

  useEffect(() => {
    const el = refs.current[state];

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
  }, [state]);

  return (
    <animated.div
      className={css["root"]}
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

export default StateLabel;
