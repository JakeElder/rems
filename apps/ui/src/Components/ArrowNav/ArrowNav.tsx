import React from "react";
import css from "./ArrowNav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong
} from "@fortawesome/free-solid-svg-icons";
import { animated, useSpring, useTransition } from "@react-spring/web";
import cn from "classnames";

type Props = {
  onNext?: () => void;
  onPrev?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  show?: boolean;
  size?: "rg" | "xl";
};

const ArrowNav = ({
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  show = true,
  size = "rg"
}: Props) => {
  const hidden = { opacity: 0, scale: 0.8 };
  const visible = { opacity: 1, scale: 1 };

  const transition = useTransition(show, {
    from: hidden,
    enter: visible,
    leave: hidden
  });

  const active = {
    background: "rgba(0, 0, 0, 0.5)",
    color: "rgba(255, 255, 255, 1)"
  };

  const inactive = {
    background: "rgba(255, 255, 255, 0.2)",
    color: "rgba(255, 255, 255, 0.2)"
  };

  const prev = useSpring(hasPrev ? active : inactive);
  const next = useSpring(hasNext ? active : inactive);

  const iconSize: React.ComponentProps<typeof FontAwesomeIcon>["size"] =
    size === "xl" ? "lg" : "sm";

  return (
    <div
      className={cn({
        [css["root"]]: true,
        [css["xl"]]: size === "xl"
      })}
    >
      <div className={css["prev"]}>
        {transition((styles, show) =>
          show ? (
            <animated.button
              style={{ ...styles, ...prev }}
              className={css["prev-button"]}
              disabled={!hasPrev}
              onClick={(e) => {
                e.preventDefault();
                hasPrev && onPrev?.();
              }}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} size={iconSize} />
            </animated.button>
          ) : null
        )}
      </div>
      <div className={css["next"]}>
        {transition((styles, show) =>
          show ? (
            <animated.button
              style={{ ...styles, ...next }}
              className={css["next-button"]}
              disabled={!hasNext}
              onClick={() => onNext?.()}
            >
              <FontAwesomeIcon icon={faArrowRightLong} size={iconSize} />
            </animated.button>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ArrowNav;
