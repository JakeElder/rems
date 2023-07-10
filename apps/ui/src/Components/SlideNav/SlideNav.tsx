import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import CloseIcon from "../../Elements/CloseIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleList,
  faEnvelope
} from "@fortawesome/free-regular-svg-icons";
import css from "./SlideNav.module.css";
import { SpringValue, animated, useTransition } from "@react-spring/web";
import NavIcon from "../../Elements/NavIcon";
import Logo from "../../Elements/Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Monogram from "../../Elements/Monogram";
import {
  faFacebookSquare,
  faInstagramSquare,
  faLine,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";

type Props = {
  defaultOpen?: boolean;
  navIconColor: SpringValue<string>;
};

const L = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const active = usePathname().split("/")[1] === href.replace(/^\//, "");
  const className = active ? css["active-link"] : css["link"];
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

const SlideNav = ({ defaultOpen = false, navIconColor }: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  const transitions = useTransition(open, {
    from: {
      opacity: 0,
      right: "-100%",
      boxShadow: "0 0 17px -6px rgba(0, 0, 0, 0)"
    },
    enter: {
      opacity: 0.4,
      right: "0%",
      boxShadow: "0 0 17px -6px rgba(0, 0, 0, 0.5)"
    },
    leave: {
      opacity: 0,
      right: "-100%",
      boxShadow: "0 0 17px -6px rgba(0, 0, 0, 0)"
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <NavIcon color={navIconColor} />
      </Dialog.Trigger>
      {transitions((styles, show) =>
        show ? (
          <>
            <Dialog.Overlay forceMount asChild>
              <animated.div
                style={{ opacity: styles.opacity }}
                className={css["overlay"]}
              />
            </Dialog.Overlay>
            <Dialog.Content forceMount asChild>
              <animated.div
                className={css["content"]}
                style={{
                  right: styles.right,
                  boxShadow: styles.boxShadow
                }}
              >
                <div className={css["header"]}>
                  <Dialog.Title className={css["logo"]}>
                    <Logo height={30} />
                  </Dialog.Title>
                  <Dialog.Close>
                    <CloseIcon />
                  </Dialog.Close>
                </div>
                <div className={css["main"]}>
                  <nav className={css["nav"]}>
                    <L href="/">
                      <span className={css["monogram"]}>
                        <Monogram />
                      </span>
                      Home
                    </L>
                    <L href="/real-estate">
                      <span className={css["icon"]}>
                        <FontAwesomeIcon icon={faRectangleList} size="sm" />
                      </span>
                      Real Estate
                    </L>
                    <L href="/contact-us">
                      <span className={css["icon"]}>
                        <FontAwesomeIcon icon={faEnvelope} size="sm" />
                      </span>
                      Contact Us
                    </L>
                  </nav>
                  <div className={css["divider"]} />
                  <div className={css["socials"]}>
                    <a className={css["linked-in"]} href="#">
                      <FontAwesomeIcon icon={faLine} size="xl" />
                    </a>
                    <a href="#">
                      <FontAwesomeIcon icon={faInstagramSquare} size="xl" />
                    </a>
                    <a href="#">
                      <FontAwesomeIcon icon={faLinkedin} size="xl" />
                    </a>
                    <a href="#">
                      <FontAwesomeIcon icon={faFacebookSquare} size="xl" />
                    </a>
                  </div>
                </div>
              </animated.div>
            </Dialog.Content>
          </>
        ) : null
      )}
      <Dialog.Portal></Dialog.Portal>
    </Dialog.Root>
  );
};

// <L href="/about-us">
//   <span className={css["icon"]}>
//     <FontAwesomeIcon icon={faAddressCard} size="sm" />
//   </span>
//   About Us
// </L>

export default SlideNav;
