"use client";

import React from "react";
import css from "./ChatInput.module.css";
import { ColorRing, LineWave } from "react-loader-spinner";
import { AssistantInputState, InputSession } from "@rems/types";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMicrophoneLines } from "@fortawesome/free-solid-svg-icons";
import c from "tinycolor2";
import EnterIcon from "../../Elements/EnterIcon/EnterIcon";
import cn from "classnames";
import { INPUT_PALETTE, MIC_PALETTE } from "../../colors";

type InputHTMLProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const useHideShow = (show: boolean) => {
  const hidden = { opacity: 0, scale: 0.8 };
  const visible = { opacity: 1, scale: 1 };

  return useTransition(show, {
    from: hidden,
    enter: visible,
    leave: hidden
  });
};

const Status = ({ state }: { state: AssistantInputState }) => {
  const loader = useHideShow(state === "RESOLVING");
  const check = useHideShow(state === "RESOLVED");
  const inputting = useHideShow(state === "LISTENING" || state === "INPUTTING");

  return (
    <div className={css["state"]}>
      {loader(
        (style, show) =>
          show && (
            <animated.div style={style} className={css["loader"]}>
              <ColorRing
                visible={true}
                height={38}
                width={38}
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={
                  c("#ecbb56")
                    .analogous(5)
                    .map((c) => c.toString()) as any
                }
              />
            </animated.div>
          )
      )}
      {check(
        (style, show) =>
          show && (
            <animated.div style={style} className={css["resolved"]}>
              <FontAwesomeIcon icon={faCheck} />
            </animated.div>
          )
      )}
      {inputting(
        (style, show) =>
          show && (
            <animated.div style={style} className={css["inputting"]}>
              <LineWave
                height={34}
                width={34}
                color="#ad3dbf"
                ariaLabel="line-wave"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                firstLineColor=""
                middleLineColor=""
                lastLineColor=""
              />
            </animated.div>
          )
      )}
    </div>
  );
};

export type Props = {
  onChange?: InputHTMLProps["onChange"];
  onMicClick?: () => void;
  enterDown: boolean;
  sessions: InputSession[];
  state: AssistantInputState;
  submittable: boolean;
} & Pick<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onKeyDown" | "onKeyUp"
>;

const Input = React.forwardRef<
  HTMLInputElement,
  Pick<Props, "state" | "enterDown" | "submittable" | "sessions"> &
    InputHTMLProps
>(({ state, enterDown, submittable, sessions, ...props }, ref) => {
  const style = useSpring(INPUT_PALETTE[state]);

  const hidden = { opacity: 0, width: 0 };
  const visible = { opacity: 1, width: 30 };

  const submit = useTransition(submittable, {
    from: hidden,
    enter: visible,
    leave: hidden
  });

  const t = useTransition(sessions, {
    keys: (s) => s.id,
    from: { height: 0 },
    enter: { height: 48 }
  });

  const session = sessions[sessions.length - 1];

  return (
    <animated.div style={style} className={css["container"]}>
      <div className={css["session-container"]}>
        {t((style, s) => {
          return (
            <animated.div style={style}>
              {(() => {
                if (s.id !== session.id) {
                  return (
                    <input
                      key={s.id}
                      value={s.value}
                      className={css["input"]}
                      disabled
                    />
                  );
                }
                return (
                  <input
                    ref={ref}
                    key={s.id}
                    value={s.value}
                    className={css["input"]}
                    disabled={state !== "INACTIVE" && state !== "INPUTTING"}
                    {...props}
                  />
                );
              })()}
            </animated.div>
          );
        })}
      </div>

      <div className={css["enter-and-status"]}>
        <div className={css["status"]}>
          <Status state={state} />
        </div>
        {submit(
          (style, show) =>
            show && (
              <animated.div style={style}>
                <div
                  className={cn(css["enter"], {
                    [css["enter-down"]]: enterDown
                  })}
                >
                  <EnterIcon />
                </div>
              </animated.div>
            )
        )}
      </div>
    </animated.div>
  );
});

const ChatInput = React.forwardRef<HTMLInputElement, Props>(
  (
    { onChange, sessions, onMicClick, state, enterDown, submittable, ...rest },
    ref
  ) => {
    return (
      <div className={css["root"]}>
        <form className={css["form"]} {...rest}>
          <div className={css["input-state-and-controls"]}>
            <div className={css["input-state"]}>
              <Input
                submittable={submittable}
                enterDown={enterDown}
                ref={ref}
                state={state}
                className={css["input"]}
                autoComplete="off"
                name="query"
                sessions={sessions}
                onChange={onChange}
              />
            </div>
            <div className={css["controls"]}>
              <Controls onMicClick={onMicClick} state={state} />
            </div>
          </div>
        </form>
      </div>
    );
  }
);

const Controls = ({
  onMicClick,
  state
}: Pick<Props, "onMicClick" | "state">) => {
  const style = useSpring(MIC_PALETTE[state]);
  return (
    <div className={css["controls"]}>
      <animated.div className={css["mic"]}>
        <animated.button
          style={style}
          onClick={onMicClick}
          type="button"
          className={css["listen-button"]}
        >
          <FontAwesomeIcon icon={faMicrophoneLines} />
        </animated.button>
      </animated.div>
    </div>
  );
};

export default React.memo(ChatInput);
