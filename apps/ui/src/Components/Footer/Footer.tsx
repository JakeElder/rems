import React from "react";
import css from "./Footer.module.css";
import Container from "../../Elements/Container";
import Logo from "../../Elements/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLine,
  faInstagramSquare,
  faLinkedin,
  faFacebookSquare
} from "@fortawesome/free-brands-svg-icons";

type Props = {};

const UL = ({
  heading,
  links
}: {
  heading: string;
  links: { href: string; text: string }[];
}) => {
  return (
    <div className={css["section"]}>
      <div className={css["heading"]}>{heading}</div>
      <ul className={css["list"]}>
        {links.map((l, idx) => (
          <li key={idx}>
            <a href={l.href}>{l.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = ({}: Props) => {
  return (
    <footer className={css["root"]}>
      <Container>
        <div className={css["links"]}>
          <UL
            heading="JYOPROPERTY"
            links={[
              { href: "#", text: "Home" },
              { href: "#", text: "Real Estate" },
              { href: "#", text: "About Us" },
              { href: "#", text: "Contact" }
            ]}
          />
          <UL
            heading="POPULAR SEARCHES"
            links={[
              { href: "#", text: "Rental Properties in Bangkok" },
              { href: "#", text: "Beach Villa's for Sale in Hua Hin" },
              { href: "#", text: "Beach Cabins in Phuket" },
              { href: "#", text: "Condos in Silom" },
              { href: "#", text: "Penthouse Suites in Sukhumvit" },
              { href: "#", text: "Land for Sale in Bangkok" }
            ]}
          />
        </div>
        <div className={css["logo-disclaimer-socials"]}>
          <div className={css["logo"]}>
            <Logo />
          </div>
          <div className={css["column-disclaimer"]}>
            Copyright © 2023 Jyo Property Co Ltd
          </div>
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
        <div className={css["full-disclaimer"]}>
          Copyright © 2023 Jyo Property Co Ltd
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
