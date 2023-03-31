"use client";

import React from "react";
import Logo from "../../Elements/Logo";
import NavIcon from "../../Elements/NavIcon";
import css from "./Header.module.css";
import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "classnames";

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

  const pathname = usePathname();

  return (
    <animated.div className={cn(css["root"], css[theme])} style={styles}>
      <Logo />
      <nav className={css["nav"]}>
        <Link
          href="/"
          className={cn({
            [css["active"]]: pathname === "/"
          })}
        >
          Home
        </Link>
        <Link
          href="/real-estate"
          className={cn({
            [css["active"]]: pathname === "/real-estate"
          })}
        >
          Real Estate
        </Link>
      </nav>
      <div className={css["nav-icon"]}>
        <NavIcon theme={theme} />
      </div>
    </animated.div>
  );
};

export default Header;
