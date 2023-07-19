"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Logo from "../../Elements/Logo";
import Container from "../../Elements/Container";
import css from "./Header.module.css";
import { SpringValue, animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SlideNav from "../SlideNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { getCookie } from "typescript-cookie";
import ContactModal from "../ContactModal";

type Props = {
  mode: "standard" | "hero";
  backHref?: null | string;
  full?: boolean;
  back?: boolean;
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

type ButtonProps = {
  style: "transparent" | "opaque";
} & Omit<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >,
  "ref"
>;

const Button = ({ style, ...props }: ButtonProps) => {
  const styles = useSpring(
    style === "transparent"
      ? { background: "#c19d54", borderColor: "transparent" }
      : { background: "transparent", borderColor: "#999999" }
  );
  return <animated.span {...props} className={css["button"]} style={styles} />;
};

const Back = ({ styles, full, href }: BackProps) => {
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

type Styles = {
  color: SpringValue<string>;
  background: SpringValue<string>;
  fill: SpringValue<string>;
  borderBottomColor: SpringValue<string>;
};

type BackProps = {
  full: Props["full"];
  href: Props["backHref"];
  styles: Styles;
};

const Header = ({ mode, full = false, backHref, back = false }: Props) => {
  const [hasScrollY, setHasScrollY] = useState(
    typeof window !== "undefined" && window.scrollY > 0
  );

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
    const onScroll = () => setHasScrollY(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [contactOpen, setContactOpen] = useState(false);
  const [slideNavOpen, setSlideNavOpen] = useState(false);

  return (
    <div>
      <animated.div className={css["root"]} style={styles}>
        <ContactModal
          open={contactOpen}
          onOpenChange={setContactOpen}
          onMessageSent={() => setTimeout(() => setContactOpen(false), 2000)}
        />
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
              <Button style={style} onClick={() => setContactOpen(true)}>
                Contact Us
              </Button>
            </div>
            <div className={css["nav-icon"]}>
              <SlideNav
                open={slideNavOpen}
                onOpenChange={setSlideNavOpen}
                navIconColor={styles.fill}
                onContactUsClick={() => setContactOpen(true)}
              />
            </div>
          </div>
        </Container>
      </animated.div>
      {back && <Back styles={styles} full={full} href={backHref} />}
    </div>
  );
};

export default Header;
