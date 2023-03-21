import React from "react";
import css from "./journey-bar.module.css";
import { motion } from "framer-motion";

type Props = {
  steps: number;
  step: number;
  onStepComplete: (step: number) => void;
  duration: number;
};

const Step = ({
  active: show = false,
  duration,
  onComplete
}: {
  active?: boolean;
  duration: number;
  onComplete: () => void;
}) => {
  return (
    <div className={css.item}>
      {show && (
        <motion.div
          className={css.fill}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: duration / 1000,
            ease: "linear"
          }}
          onAnimationComplete={onComplete}
        />
      )}
    </div>
  );
};

const JourneyBar = ({
  steps,
  step,
  duration,
  onStepComplete = () => {}
}: Props) => {
  return (
    <div className={css.root}>
      {[...Array(steps)].map((_, idx) => (
        <Step
          key={idx}
          active={step === idx}
          duration={duration}
          onComplete={() => onStepComplete(idx)}
        />
      ))}
    </div>
  );
};

export default JourneyBar;
