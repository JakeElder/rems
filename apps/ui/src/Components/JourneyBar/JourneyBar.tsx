import React from "react";
import css from "./JourneyBar.module.css";
import Step from "./Step";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  steps: number;
  step: number;
  duration: number;
  onStepComplete: (step: number) => void;
  onNextRequest?: () => void;
  onPrevRequest?: () => void;
};

const JourneyBar = ({
  steps,
  step,
  duration,
  onStepComplete = () => {},
  onNextRequest = () => {},
  onPrevRequest = () => {}
}: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["bar"]}>
        {[...Array(steps)].map((_, idx) => (
          <Step
            key={idx}
            active={step === idx}
            duration={duration}
            onComplete={() => onStepComplete(idx)}
          />
        ))}
      </div>
      <div className={css["controls"]}>
        <FontAwesomeIcon
          icon="arrow-left-long"
          size="lg"
          onClick={onPrevRequest}
          className={css["arrow"]}
        />
        <FontAwesomeIcon
          icon="arrow-right-long"
          size="lg"
          onClick={onNextRequest}
          className={css["arrow"]}
        />
      </div>
    </div>
  );
};

export default JourneyBar;
