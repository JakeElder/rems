import React from "react";
import Modal from "../Modal";
import css from "./NavModal.module.css";
import Link from "next/link";
import CloseIcon from "../../Elements/CloseIcon";
import Logo from "../../Elements/Logo";
import Container from "../../Elements/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLine,
  faInstagramSquare,
  faLinkedin,
  faFacebookSquare
} from "@fortawesome/free-brands-svg-icons";
import { usePathname } from "next/navigation";

type Props = {
  open: boolean;
  onCloseRequest: React.ComponentProps<typeof Modal>["onCloseRequest"];
};

const L = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const active = usePathname() === href;
  const className = active ? css["active-link"] : css["link"];
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

const NavModal = ({ open, onCloseRequest }: Props) => {
  return (
    <Modal open={open} onCloseRequest={onCloseRequest}>
      <div className={css["root"]}>
        <div className={css["header"]}>
          <Container>
            <div className={css["logo-and-close"]}>
              <Logo />
              <a
                className={css["close-button"]}
                role="button"
                onClick={onCloseRequest}
              >
                <CloseIcon />
              </a>
            </div>
          </Container>
        </div>
        <nav className={css["nav"]}>
          <L href="/">Home</L>
          <L href="/real-estate">Real Estate</L>
          <L href="/about-us">About Us</L>
          <L href="/contact-us">Contact Us</L>
        </nav>
        <div className={css["hr"]} />
        <div className={css["socials"]}>
          <a className={css["linked-in"]} href="#">
            <FontAwesomeIcon icon={faLine} size="lg" />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faInstagramSquare} size="lg" />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
          <a href="#">
            <FontAwesomeIcon icon={faFacebookSquare} size="lg" />
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default NavModal;
