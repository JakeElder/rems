"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Logo from "../../Elements/Logo";
import NavIcon from "../../Elements/NavIcon";
import Container from "../../Elements/Container/Container";
import css from "./Header.module.css";
import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  mode: "standard" | "hero";
};

const L = animated(Link);

const A = ({
  href,
  style,
  children
}: {
  href: string;
  children: ReactNode;
  style: "transparent" | "opaque";
}) => {
  const active = usePathname() === href;
  const opacity = active ? "1" : "0.7";
  const styles = useSpring(
    style === "transparent"
      ? { color: `rgba(255, 255, 255, ${opacity})` }
      : { color: `rgba(0, 0, 0, ${opacity})` }
  );
  return <L href={href} children={children} style={styles} />;
};

const Header = ({ mode }: Props) => {
  const [hasScrollY, setHasScrollY] = useState(false);
  const style = mode === "hero" && !hasScrollY ? "transparent" : "opaque";

  const styles = useSpring(
    style === "transparent"
      ? {
        background: "rgba(255, 255, 255, 0)",
        color: "rgba(255, 255, 255, 0.7)",
        fill: "rgba(255, 255, 255, 1)",
        borderBottomColor: "rgba(255, 255, 255, 0.2)"
      }
      : {
        background: "rgba(255, 255, 255, 1)",
        color: "rgba(0, 0, 0, 0.7)",
        fill: "rgba(0, 0, 0, 1)",
        borderBottomColor: "rgb(234, 234, 234, 1)"
      }
  );

  useEffect(() => {
    const onScroll = () => setHasScrollY(window.pageYOffset > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <animated.div className={css["root"]} style={styles}>
      <Container>
        <div className={css["container"]}>
          <Logo />
          <nav className={css["nav"]}>
            <A href="/" style={style}>
              Home
            </A>
            <A href="/real-estate" style={style}>
              Real Estate
            </A>
            <A href="/about-us" style={style}>
              About Us
            </A>
          </nav>
          <div className={css["nav-icon"]}>
            <NavIcon color={styles.fill} />
          </div>
        </div>
      </Container>
    </animated.div>
  );
};

export default Header;
