"use client";

import React, { ReactNode, createContext, useEffect, useState } from "react";
import LogoElement from "../../Elements/Logo";
import Container from "../../Elements/Container";
import css from "./Header.module.css";
import {
  AnimatedComponent,
  SpringValue,
  animated,
  useSpring
} from "@react-spring/web";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { getCookie } from "typescript-cookie";
import NavIcon from "../../Elements/NavIcon";
import { AssistantMode } from "@rems/types";

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
    ? usePathname()!.split("/")[1] === href.replace(/^\//, "")
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

type ButtonProps = React.ComponentProps<AnimatedComponent<"span">> & {
  style: "transparent" | "opaque";
};

const Button = ({ style, ...props }: ButtonProps) => {
  const styles = useSpring(
    style === "transparent"
      ? { background: "#c19d54", borderColor: "transparent" }
      : { background: "transparent", borderColor: "#999999" }
  );
  return <animated.span {...props} className={css["button"]} style={styles} />;
};

type Styles = {
  color: SpringValue<string>;
  background: SpringValue<string>;
  fill: SpringValue<string>;
  borderBottomColor: SpringValue<string>;
};

type HeaderContext = {
  style: "transparent" | "opaque";
  full: Props["full"];
  onContactUsClick: Props["onContactUsClick"];
  onNavIconClick: Props["onNavIconClick"];
  styles: Styles;
};

const Context = createContext<HeaderContext | null>(null);

const useContext = () => {
  const ctx = React.useContext(Context);
  if (ctx === null) {
    throw new Error();
  }
  return ctx;
};

export type Props = {
  children: React.ReactNode;
  mode: "standard" | "hero";
  full?: boolean;
  onContactUsClick: () => void;
  onNavIconClick: () => void;
};

export const Root = ({
  children,
  mode,
  full,
  onContactUsClick,
  onNavIconClick
}: Props) => {
  const [hasScrollY, setHasScrollY] = useState(
    typeof window !== "undefined" && window.scrollY > 0
  );

  useEffect(() => {
    const onScroll = () => setHasScrollY(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <Context.Provider
      value={{ style, styles, full, onContactUsClick, onNavIconClick }}
    >
      <div className={css["root"]}>{children}</div>
    </Context.Provider>
  );
};

const LOGO_COLOR_IDLE = "rgba(0, 0, 0, 1)";
const LOGO_COLOR_LISTENING = "rgba(0, 203, 255, 1)";
const LOGO_COLOR_THINKING = "rgba(234, 180, 71, 1)";
const LOGO_COLOR_WORKING = "rgba(140, 46, 187, 1)";
const LOGO_COLOR_CHATTING = "rgba(43, 171, 84, 1)";

const logoColor = (mode: AssistantMode) => {
  if (mode === "LISTENING") return LOGO_COLOR_LISTENING;
  if (mode === "THINKING") return LOGO_COLOR_THINKING;
  if (mode === "WORKING") return LOGO_COLOR_WORKING;
  if (mode === "CHATTING") return LOGO_COLOR_CHATTING;
  return LOGO_COLOR_IDLE;
};

export const Logo = ({ assistantMode }: { assistantMode: AssistantMode }) => {
  const { style } = useContext();
  const styles = useSpring({
    fill:
      style === "transparent"
        ? "rgb(255, 255, 255, 1)"
        : logoColor(assistantMode)
  });
  return (
    <animated.div style={styles}>
      <Link href="/" className={css["logo"]}>
        <LogoElement />
      </Link>
    </animated.div>
  );
};

export const ChatInput = ({ children }: { children: React.ReactNode }) => {
  return <div className={css["chat-input"]}>{children}</div>;
};

export const NavAndContact = () => {
  const { style, styles, onContactUsClick, onNavIconClick } = useContext();
  return (
    <>
      <div className={css["nav-and-contact-button"]}>
        <nav className={css["nav"]}>
          <A href="/" style={style}>
            Home
          </A>
          <A href="/real-estate" style={style}>
            Real Estate
          </A>
        </nav>
        <Button style={style} onClick={() => onContactUsClick()}>
          Contact Us
        </Button>
      </div>
      <div className={css["nav-icon"]} onClick={() => onNavIconClick()}>
        <NavIcon color={styles.fill} />
      </div>
    </>
  );
};

export const Main = ({ children }: { children: React.ReactNode }) => {
  const { full, styles } = useContext();
  return (
    <animated.div className={css["main"]} style={styles}>
      <Container full={full}>
        <div className={css["container"]}>{children}</div>
      </Container>
    </animated.div>
  );
};

export const Back = ({ href }: { href: string }) => {
  const { full, styles } = useContext();
  const cookieHref = getCookie("referer");

  const link = cookieHref ? cookieHref : href;

  if (!link) {
    return null;
  }

  return (
    <animated.div className={css["back"]} style={styles}>
      <Container full={full}>
        <div className={css["back-inner"]}>
          <Link href={link} className={css["back-link"]}>
            <span className={css["icon"]}>
              <FontAwesomeIcon icon={faArrowLeftLong} />
            </span>
            <span>Back to search</span>
          </Link>
        </div>
      </Container>
    </animated.div>
  );
};
