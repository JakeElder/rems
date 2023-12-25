"use client";

import React, { forwardRef } from "react";
import css from "./PropertyRowContainer.module.css";
import { animated, useTransition } from "@react-spring/web";

type Props = {
  loading: boolean;
  children: React.ReactNode;
};

const PropertyRowContainer = forwardRef<HTMLDivElement, Props>(
  ({ loading, children }, ref) => {
    const transition = useTransition(loading, {
      from: { backgroundColor: "rgba(255, 255, 255, 0)" },
      enter: { backgroundColor: "rgba(255, 255, 255, .7)" },
      leave: { backgroundColor: "rgba(255, 255, 255, 0)" }
    });

    return (
      <div className={css["root"]} ref={ref}>
        <div className={css["properties"]}>{children}</div>
        {transition(
          (styles, show) =>
            show && <animated.div className={css["loading"]} style={styles} />
        )}
      </div>
    );
  }
);

export default PropertyRowContainer;
