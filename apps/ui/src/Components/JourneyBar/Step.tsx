import React, { useEffect, useRef } from "react";
import css from "./JourneyBar.module.css";

type Props = {
  active?: boolean;
  duration: number;
  onComplete: () => void;
};

const Step = ({ active = false, duration, onComplete }: Props) => {
  const $fill = useRef<HTMLDivElement | null>(null);

  const cleanup = ($el: HTMLDivElement) => {
    $el.ontransitionend = null;
    $el.style.transition = "unset";
    $el.style.width = "0";
  };

  useEffect(() => {
    if (!$fill.current) {
      return;
    }
    if (active) {
      $fill.current.style.transition = `width ${duration}ms linear`;
      $fill.current.ontransitionend = () => {
        cleanup($fill.current!);
        onComplete();
      };
      $fill!.current!.style.width = "100%";
    } else {
      cleanup($fill.current);
    }
  }, [active]);

  return (
    <div className={css["item"]}>
      <div ref={$fill} className={css["fill"]} />
    </div>
  );
};

export default Step;
