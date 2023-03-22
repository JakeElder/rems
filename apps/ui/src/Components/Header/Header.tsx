import React from "react";
import Logo from "../../Elements/Logo";
import NavIcon from "../../Elements/NavIcon";
import css from "./Header.module.css";
import { animated, useSpring } from "@react-spring/web";

type Props = {
  theme: "dark" | "light";
};

const Header = ({ theme }: Props) => {
  const styles = useSpring(
    theme === "light"
      ? {
          background: "rgba(255, 255, 255, 0)",
          fill: "#fff",
          borderBottomColor: "rgba(255, 255, 255, 0.2)"
        }
      : {
          background: "rgba(255, 255, 255, 1)",
          fill: "#333",
          borderBottomColor: "#EAEAEA"
        }
  );

  return (
    <animated.div className={css["root"]} style={styles}>
      <Logo />
      <div className={css["nav-icon"]}>
        <NavIcon theme={theme} />
      </div>
    </animated.div>
  );
};

export default Header;
