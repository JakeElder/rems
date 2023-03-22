import React from "react";
import css from "./JourneyBar.module.css";
import Step from "./Step";

type Props = {
  steps: number;
  step: number;
  onStepComplete: (step: number) => void;
  duration: number;
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
