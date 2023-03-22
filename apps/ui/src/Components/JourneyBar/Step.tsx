import React from "react";
import css from "./JourneyBar.module.css";
import { motion } from "framer-motion";

type Props = {
  active?: boolean;
  duration: number;
  onComplete: () => void;
};

const Step = ({ active = false, duration, onComplete }: Props) => {
  return (
    <div className={css.item}>
      {active && (
        <motion.div
          className={css.fill}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          onAnimationComplete={onComplete}
        />
      )}
    </div>
  );
};

export default Step;
