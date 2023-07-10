"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Logo from "../../Elements/Logo";
import Container from "../../Elements/Container/Container";
import css from "./Header.module.css";
import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SlideNav from "../SlideNav/SlideNav";

type Props = {
  mode: "standard" | "hero";
  full?: boolean;
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
  const pathname = usePathname();
  const active = pathname
    ? usePathname().split("/")[1] === href.replace(/^\//, "")
    : false;

  const opacity = active ? "1" : "0.7";
  const fontWeight = active ? 500 : 400;
  const styles = useSpring(
    style === "transparent"
      ? { color: `rgba(255, 255, 255, ${opacity})`, fontWeight }
      : { color: `rgba(0, 0, 0, ${opacity})`, fontWeight }
  );
  return <L href={href} children={children} style={styles} />;
};

const Button = ({
  style,
  children
}: {
  style: "transparent" | "opaque";
  children: React.ReactNode;
}) => {
  const styles = useSpring(
    style === "transparent"
      ? { background: "#c19d54", borderColor: "transparent" }
      : { background: "transparent", borderColor: "#999999" }
  );

  return (
    <animated.button className={css["button"]} style={styles}>
      {children}
    </animated.button>
  );
};

const Header = ({ mode, full = false }: Props) => {
  const [hasScrollY, setHasScrollY] = useState(window.pageYOffset > 0);
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
    <div>
      <animated.div className={css["root"]} style={styles}>
        <Container full={full}>
          <div className={css["container"]}>
            <Link href="/" className={css["logo"]}>
              <Logo />
            </Link>
            <div className={css["nav-and-contact-button"]}>
              <nav className={css["nav"]}>
                <A href="/" style={style}>
                  Home
                </A>
                <A href="/real-estate" style={style}>
                  Real Estate
                </A>
              </nav>
              <Button style={style}>Contact Us</Button>
            </div>
            <div className={css["nav-icon"]}>
              <SlideNav navIconColor={styles.fill} />
            </div>
          </div>
        </Container>
      </animated.div>
    </div>
  );
};

export default Header;
