import React from "react";
import css from "./JourneyBar.module.css";
import Step from "./Step";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faArrowRightLong
} from "@fortawesome/free-solid-svg-icons";

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
        <span role="button">
          <FontAwesomeIcon
            icon={faArrowLeftLong}
            size="lg"
            onClick={onPrevRequest}
            className={css["arrow"]}
          />
        </span>
        <span role="button">
          <FontAwesomeIcon
            icon={faArrowRightLong}
            size="lg"
            onClick={onNextRequest}
            className={css["arrow"]}
          />
        </span>
      </div>
    </div>
  );
};

export default JourneyBar;
