import { SpringValue, animated } from "@react-spring/web";
import * as React from "react";

type Props = {
  color: SpringValue<string>;
};

const NavIcon = ({ color }: Props) => {
  return (
    <animated.div style={{ stroke: color, strokeWidth: 1.6 }}>
      <svg width={20} height={14} xmlns="http://www.w3.org/2000/svg">
        <path d="M0 13.044h20M0 7.044h20M0 1.044h20" />
      </svg>
    </animated.div>
  );
};

export default NavIcon;
