"use client";

import React, { useState } from "react";
import css from "./AiSearch.module.css";
import { ColorRing, LineWave } from "react-loader-spinner";
import { AiSearchInputState, AiSearchSession } from "@rems/types";
import { animated, useSpring, useTransition, config } from "@react-spring/web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faMicrophoneLines,
  faMicrophoneLinesSlash
} from "@fortawesome/free-solid-svg-icons";
import c from "tinycolor2";
import EnterIcon from "../../Elements/EnterIcon/EnterIcon";
import cn from "classnames";

const useColors = (state: AiSearchInputState) => {
  const map: Record<
    AiSearchInputState,
    {
      backgroundColor: string;
      borderColor: string;
      color: string;
    }
  > = {
    inactive: {
      borderColor: "#ccc",
      // backgroundColor: c("#aaa").lighten(0.95).toString(),
      backgroundColor: "rgba(255, 255, 255, 0)",
      color: "#444"
    },
    inputting: {
      borderColor: "#ad3dbf",
      // backgroundColor: c("#ad3dbf").lighten(50).toString(),
      backgroundColor: "rgba(255, 255, 255, 0)",
      color: c("#ad3dbf").darken(12).toString()
    },
    listening: {
      borderColor: "#ad3dbf",
      // backgroundColor: c("#ad3dbf").lighten(0.95).toString(),
      backgroundColor: "rgba(255, 255, 255, 0)",
      color: c("#ad3dbf").darken(16).toString()
    },
    resolving: {
      borderColor: "#ecbb56",
      backgroundColor: c("#ecbb56").lighten(36).toString(),
      color: c("#ecbb56").darken(16).toString()
    },
    resolved: {
      borderColor: "#19c351",
      backgroundColor: c("#19c351").lighten(56).toString(),
      // backgroundColor: "rgba(255, 255, 255, 0)",
      color: c("#19c351").darken(16).toString()
    },
    committed: {
      borderColor: "#ccc",
      // backgroundColor: c("#ccc").lighten(0.95).toString(),
      backgroundColor: "rgba(255, 255, 255, 0)",
      color: c("#ccc").darken(0.3).toString()
    }
  };

  const { borderColor, color, backgroundColor } = map[state];
  return useSpring({ backgroundColor, borderColor, color });
};

type InputHTMLProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type Props = {
  onChange?: InputHTMLProps["onChange"];
  onMicClick?: () => void;
  enterDown: boolean;
  sessions: AiSearchSession[];
  state: AiSearchInputState;
  submittable: boolean;
} & Pick<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onKeyDown" | "onKeyUp"
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

const Status = ({ state }: { state: AiSearchInputState }) => {
  const loader = useHideShow(state === "resolving");
  const check = useHideShow(state === "resolved");
  const inputting = useHideShow(state === "listening" || state === "inputting");

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

const Input = React.forwardRef<
  HTMLInputElement,
  {
    state: AiSearchInputState;
    enterDown: boolean;
    submittable: boolean;
    sessions: AiSearchSession[];
  } & InputHTMLProps
>(({ state, enterDown, submittable, sessions, ...props }, ref) => {
  const style = useColors(state);

  const hidden = { opacity: 0, width: 0 };
  const visible = { opacity: 1, width: 26 };

  const submit = useTransition(submittable, {
    from: hidden,
    enter: visible,
    leave: hidden
  });

  const t = useTransition(Array.from(Array(sessions.length).keys()), {
    from: { height: 0 },
    enter: { height: 36 }
  });

  return (
    <animated.div style={style} className={css["container"]}>
      <div className={css["session-container"]}>
        {t((style, idx) => {
          const s = sessions[idx];
          return (
            <animated.div style={style}>
              {(() => {
                if (idx !== sessions.length - 1) {
                  return (
                    <input
                      key={s.id}
                      value={sessions[idx].value}
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
                    disabled={state !== "inactive" && state !== "inputting"}
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

const AiSearch = React.memo(
  React.forwardRef<HTMLInputElement, Props>(
    (
      {
        onChange,
        sessions,
        onMicClick,
        state,
        enterDown,
        submittable,
        ...rest
      },
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
  )
);

const Controls = ({
  onMicClick,
  state
}: Pick<Props, "onMicClick" | "state">) => {
  const style = useColors(state);
  // const listen = useHideShow(state === "inactive" || state === "listening");
  const listen = useHideShow(true);

  const colors = useSpring({
    color: state === "listening" ? c("#ad3dbf").darken(10).toString() : "#aaa",
    backgroundColor:
      state === "listening" ? c("#ad3dbf").lighten(40).toString() : "#eee"
  });

  return (
    <div className={css["controls"]}>
      <animated.div className={css["mic"]}>
        {listen(
          (style, show) =>
            show && (
              <animated.button
                style={colors}
                onClick={onMicClick}
                type="button"
                className={css["listen-button"]}
              >
                <FontAwesomeIcon icon={faMicrophoneLines} />
              </animated.button>
            )
        )}
      </animated.div>
    </div>
  );
};

export default React.memo(AiSearch);
