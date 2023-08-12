import React from "react";
import css from "./Outline.module.css";
import { animated, useSpring, config } from "@react-spring/web";

type Props = {
  children: React.ReactNode;
  on?: boolean;
};

const Outline = ({ children, on }: Props) => {
  const style = useSpring({
    color: on ? "#000" : "#777",
    borderColor: on ? "#000" : "#dfdfdf",
    config: { tension: 200, friction: 26 }
  });

  return (
    <animated.div style={style} className={css["root"]}>
      {children}
    </animated.div>
  );
};

export default Outline;
