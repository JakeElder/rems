import { animated, useSpring } from "@react-spring/web";
import * as React from "react";

type Props = {
  theme: "light" | "dark";
};

const NavIcon = ({ theme }: Props) => {
  const { stroke } = useSpring({
    stroke: theme === "light" ? "#fff" : "#444"
  });

  return (
    <animated.div style={{ stroke, strokeWidth: 1.6 }}>
      <svg width={20} height={14} xmlns="http://www.w3.org/2000/svg">
        <path d="M0 13.044h20M0 7.044h20M0 1.044h20" />
      </svg>
    </animated.div>
  );
};

export default NavIcon;
